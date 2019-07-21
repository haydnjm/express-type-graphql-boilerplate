import { Arg, Query, Resolver, Int } from "type-graphql";
import Test from './schema';

@Resolver(of => Test)
class TestResolvers{
  @Query(returns => Int)
  testQuery(@Arg("param") param: number) {
    return param + 5;
  }
}

export default [TestResolvers];