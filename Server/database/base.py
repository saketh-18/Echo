from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Base.metadata contains all the details about our tables
# we pass Base while creating classes   