from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uuid
import asyncio
import time
from routers import test
from routers import username
from routers import messages
from routers import connections
from core.state import state
import asyncio
from core.state import state
from routers.auth import decode_fastapi_users_jwt, fastapi_users, auth_backend, UserRead, UserCreate, get_token_payload
from fastapi.middleware.cors import CORSMiddleware
from database.session import engine
from database.base import Base
from database.models.user import User
from database.models.connection import Connection
from database.models.messages import Messages

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://echo-random-chat.vercel.app"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

on_test = True

# Initialize database on startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# logging.getLogger("uvicorn.error").setLevel(logging.WARNING)
# logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)

# This automatically creates /auth/register
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

# connection route
app.include_router(connections.router);

# messages route
app.include_router(messages.router);

# route for getting username
app.include_router(username.router);

#test route to wake up render
app.include_router(test.router)


async def heartbeat(websocket : WebSocket, session_state : dict):
    try:
        while not on_test:
            await websocket.send_json({"type": "ping"})
            await asyncio.sleep(20);
            if time.time() - session_state["last_pong"] > 1200:
                try:
                    await websocket.close()
                except Exception:
                    pass;
                break
    except:
        pass;
    

# @app.get("/all_users")
# async def home_route(db : AsyncSession = Depends(get_db)):
#     query = select(User);
    
#     result = await db.execute(query);
#     return result.scalars().all()


# @app.get("/protected")
# def validate(payload : dict = Depends(get_token_payload)):
#     user_id = payload.get("sub");
    
#     return {
#         "userid" : user_id,
#         "message" : "yayyyy"
#     }
    
    

@app.websocket("/ws")
async def websocket_handler(websocket : WebSocket):
    await websocket.accept();
    is_authorized = False
    payload = None
    user_id = None
    token = websocket.query_params.get("token");
    
    # heartbeat_state = {"last_pong" : time.time()};
    # heartbeat_task = asyncio.create_task(heartbeat(websocket, heartbeat_state));
    
    # username = websocket.query_params.get("username");                    
    # state.matcher.username_map[websocket] = username
    """ AUTHENTICATION """
     
    if token:
        print(f"Token received: {token[:20]}...")  # Log first 20 chars for debugging
        payload = decode_fastapi_users_jwt(token)
        if payload:
            user_id = payload.get("sub")
            print(f"JWT decoded successfully. User ID: {user_id}, Payload keys: {list(payload.keys())}");
            await websocket.send_json({
                "type" : "auth-confirm",
                "isLoggedIn" : "true"
            });
        else:
            print(f"JWT decode failed for token: {token[:20]}...");
            await websocket.send_json({
                "type" : "auth-confirm",
                "isLoggedIn" : "false"
            })
    else:
        print("No token provided in query params")
        await websocket.send_json({
                "type" : "auth-confirm",
                "isLoggedIn" : "false"
            })
    
    # mode = websocket.query_params.get("mode");
    # connection_id = websocket.query_params.get("connection_id");
    
    if user_id:
        # Convert user_id to UUID for consistent dictionary key format
        try:
            user_id_uuid_key = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
            state.matcher.active_users[user_id_uuid_key] = websocket # setting user is active
            state.connection_store.sessions[websocket] = {
                "uid": user_id_uuid_key, 
                "is_authenticated": True,
                # username may arrive later via set_username; set after that message
                "username": None,
            }
            is_authorized = True
        except (ValueError, TypeError):
            # If conversion fails, use string as fallback
            state.matcher.active_users[user_id] = websocket
    
    
    # state.matcher.username_map[websocket] = username; 
    async def start_matching(websocket, interests : str = ""):
        username = state.matcher.username_map.get(websocket)
        if not username:
            await websocket.send_json({
                "type": "error",
                "data": {"message": "username not set yet; send set_username first"}
            })
            return
        user = {
                "socket" : websocket,
                "username" : username,
                "interests": [i.strip().lower() for i in interests.split(',') if i.strip()],
                "uid": payload["sub"] if payload else None,
            }
        
        state.connection_store.sessions[websocket] = {
                                "uid": payload["sub"] if payload else None,
                                "is_authenticated": is_authorized,
                                "username": username,
                            }
        matched, user1, user2, based_on = await state.matcher.try_match(user)
        
                    
        if matched:
            await state.matcher.confirm_connection(user1, user2, based_on)
        else:
            await websocket.send_json({
                "type": "system",
                "data": { "message": "Waiting for a partner..." }
            })

    
    # Fetched from first message
    while True:
        skipped = False
        try:
            while True:
                data = await websocket.receive_json();
                msg_type = data.get("type")
                #  ========================
                # >>> RANDOM MATCHING LOGIC
                #  ========================
                if (msg_type == "random"):
                    interests = data.get("interests", "")
                    await start_matching(websocket, interests)
                elif msg_type == "chat":
                    if data["context"] == "saved":
                        if not is_authorized:
                           await websocket.send_json({
                                "type" : "system",
                                "data" : {
                                    "message" : "you need to be logged in to chat with saved chats"
                                }
                            })
                    await state.messenger.handle_chat(websocket, data)
                elif msg_type == "set_username":
                    print(data);
                    username = data.get("data", {}).get("username")
                    state.matcher.username_map[websocket] = username
                    # backfill session record if it was created earlier (auth path)
                    session = state.connection_store.sessions.get(websocket)
                    if session is not None:
                        session["username"] = username
                elif msg_type == "system":
                    skipped = await state.messenger.handle_system(websocket, data);
                    print(skipped)
                    if skipped:
                        break;
        except WebSocketDisconnect:
            await state.messenger.cleanup(websocket, skipped)
            break
            # Inner loop broken - perform cleanup
        await state.messenger.cleanup(websocket, skipped);
        
        if skipped:
            print(
                'outer', skipped
            )
            await start_matching(websocket)
            continue
            # If skipped, stay in outer loop to allow re-matching, otherwise exit
        if not skipped:
            break;
                
        

                



  
            