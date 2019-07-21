import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
class Test {
  @Field(type => Int)
  param: number;
}

export default Test;