export type WSMessage = {
    type : string,
    context? : string,
    data : {
        message : string,
        timestamp : string,
        sender : string,
    },
    
};

export type systemMessage = {
    type : string,
    data : {
        action? : string,
        message? : string,
        connection_id? : string
    }
}

export type typingMessage = {
    type : string,
    username : string,
    isTyping : boolean,
}

export type errorMessage = {
    type : string,
    data:  {
        message : string
    }
}


export type savedMessage = {
    type: string,
    context : string,
    data : {
        connection_id : string,
        message : string,
        sender : string, 
        timestamp : string
    }
}

export type startMatchingMessage = {
    type : string,
    interests? : string
}

export type setUsernameMessage = {
    type: string,
    data : {
        username : string
    }
}   

export type authConfirmMessage = { 
    type:string,
    data : {
        token : string
    }
}
export type AnyMessage = WSMessage | systemMessage | savedMessage | typingMessage | errorMessage | startMatchingMessage | setUsernameMessage | authConfirmMessage;