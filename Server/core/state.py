from matcher import matcher
from MessageHandler import MessageHandler
from ConnectionStore import connection_store

class AppState:
    def __init__(self):
        self.matcher = matcher
        self.messenger = MessageHandler(self.matcher)
        self.connection_store = connection_store
        
state = AppState();

