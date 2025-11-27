import strawberry
from .resolvers import Query, Mutation
from .context import get_context

schema = strawberry.Schema(query=Query, mutation=Mutation)
