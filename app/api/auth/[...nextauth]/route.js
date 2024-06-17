import { formatIp } from '@/lib/Helper'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import users from "@/hidden/_users.json"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'e.g john doe' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                try {
                    const { username, password } = credentials
                    
                    if(users) {
                        if(username in users) {
                            const data = users[username]
                            if(password === data.password) {
                                return data
                            } else {
                                throw new Error("Username / password is wrong!")
                            }
                        } else {
                            throw new Error("Username / password is wrong!")
                        }
                    } else {
                        throw new Error("No users found.")
                    }
                } catch(e) {
                    throw new Error(e)
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },
        async session({ session, token }) {
            session.token = token
            return session
        },
        async signIn({ user, account, profile, email, credentials }) {
            if(user?.error) {
                throw new Error(user?.error)
            }
            return true
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    }
}

const handler = NextAuth(authOptions)

export {
    handler as GET,
    handler as POST
}