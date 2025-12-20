import asyncio
import websockets
import random
import time
import json

URL = "ws://127.0.0.1:8000/ws"

async def user_simulation(user_id):
    username = f"user_{user_id}"
    interests = random.choice(["music", "tech", "sports", "movies", "telugu", "hindi", "tamil", "cricket"])
    uri = f"{URL}?username={username}&interests={interests}"

    try:
        async with websockets.connect(uri) as ws:

            start = time.time()

            # Run skip abuse for ~30 seconds per user
            while time.time() - start < 30:

                action = random.random()

                # 70% chance → skip
                if action < 0.7:
                    await ws.send(json.dumps({
                        "type": "system",
                        "data" : {
                            "action" : "skip"
                        }
                    }))

                # 30% chance → send message
                else:
                    await ws.send(json.dumps({
                        "type": "chat",
                        "data": {
                            "message": "hello"
                        }
                    }))

                # Very small delay → abuse behavior
                await asyncio.sleep(random.uniform(0.3, 1.0))

            # stay connected a bit before disconnect
            await asyncio.sleep(2)

    except Exception as e:
        print(f"User {user_id} failed: {e}")

async def main(total_users=500):
    tasks = []
    for i in range(total_users):
        tasks.append(asyncio.create_task(user_simulation(i)))
        await asyncio.sleep(0.01)  # ramp-up is CRITICAL

    await asyncio.gather(*tasks)

if __name__ == "__main__":
    start = time.time()
    asyncio.run(main(500))
    print("Done in", time.time() - start)
