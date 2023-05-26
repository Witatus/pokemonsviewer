import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
// import Auth0Provider from "next-auth/providers/auth0"
import CredentialsProvider from "next-auth/providers/credentials";
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"
import { JwtPayload, decode } from "jsonwebtoken"
import { User } from "next-auth/core/types"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text"},
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, _req) {
        const payload = {
          name: credentials!.username,
          password: credentials!.password,
        }

        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/login", {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" }
        })
        const token = await res.json()
        const decoded =  decode(token.token) as JwtPayload

        const user: User = {
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          accessToken: token.token,
          accessTokenExpires: Date.now() + decoded.exp! * 1000,
        } 

        if (!res.ok) {
          throw new Error(token.message)
        }
        
        if (res.ok && user) {
          return user
        }
        return null
      }
    }),

  ],
  theme: {
    colorScheme: "light",
  },
  session :{
    strategy: "jwt",
  },
  callbacks: {

    async jwt({ token, user, account }) {

      if (account && user) {
        const accessToken = user.accessToken;
        
        const isNotBlacklisted = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL+ "/api/auth/blacklist", {
          method: "GET",
          headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}` },
        })

        if (!isNotBlacklisted.ok) {
          throw new Error('Token is blacklisted.');
        }
        
        return {
          ...token,
          accessToken: token.accessToken,
          user
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.name = token.user.name
      session.user.accessToken = token.user.accessToken
      session.user.role = token.user.role
      return session
    },
  },
  secret: "mysecret",
  pages :{
    signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)