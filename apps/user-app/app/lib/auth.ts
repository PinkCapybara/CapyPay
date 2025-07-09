/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@example.com",
        },
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password" },
      },
      // TODO: User credentials type from next-aut
      async authorize(credentials: any) {
        // Do zod validation, OTP validation here
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            number: credentials.phone,
            auth_type: "Credentials",
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password,
          );
          if (passwordValidation) {
            console.log("Existing User: ", existingUser);
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              number: existingUser.number,
              auth_type: existingUser.auth_type,
            };
          }
          return null;
        }

        try {
          const user = await db.user.create({
            data: {
              email: credentials.email,
              number: credentials.phone,
              password: hashedPassword,
            },
          });

          console.log("User: ", user);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            number: user.number,
            auth_type: user.auth_type,
          };
        } catch (e) {
          console.error(e);
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          auth_type: "Google",
          number: null,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          auth_type: "GitHub",
          number: null,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  session: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider !== "credentials") {
        try {
          const existingUser = await db.user.findUnique({
            where: { id: user.id },
          });

          if (!existingUser) {
            await db.user.create({
              data: {
                id: user.id,
                email: user.email || null,
                name: user.name || "",
                auth_type: account.provider === "google" ? "Google" : "Github",
                password: "oauth-user-no-password",
              },
            });

            await db.balance.create({
              data: {
                userId: user.id,
                amount: 0,
                locked: 0,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error creating OAuth user:", error);
          return false;
        }
      }
      return true;
    },
    async session({ token, session }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.number = token.number as string | null;
        session.user.auth_type = token.auth_type as string;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.number = user.number || null;
        token.auth_type = user.auth_type;
      }
      return token;
    },
  },
};
