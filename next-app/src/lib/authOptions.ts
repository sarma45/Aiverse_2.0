import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
