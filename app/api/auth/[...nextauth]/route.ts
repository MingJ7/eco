import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth, { Session } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"
import { MongoDBAdapterWithRole, UserWithRole } from "@/lib/my-mongodb-adapter"
import { AdapterUser } from "next-auth/adapters"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId:"729740168548-o1o2f2t1trffsllu4n299bo2sb6nokp2.apps.googleusercontent.com",
      clientSecret:"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",
    })
    // ...add more providers here
  ],
  // adapter: MongoDBAdapter(clientPromise, {
  //   databaseName: "Auth"
  // }),
  adapter: MongoDBAdapterWithRole(clientPromise, {
    databaseName: "Auth"
  }),

  callbacks: {
    async session({session, user}: {session: Session, user: UserWithRole}){
      if (session.user) session.user.role = user.role ?? "User"
      return session
    }
  }
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }