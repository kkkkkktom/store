"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
// import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  console.log(account); 

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
    fullName,
    email,
  }: {
    fullName: string;
    email: string;
  }) => {
    const existingUser = await getUserByEmail(email);
  
    const accountId = await sendEmailOTP({ email });
    console.log("Account ID:", accountId); // Add this line to check the accountId value
    if (!accountId) throw new Error("Failed to send an OTP");
  
    if (!existingUser) {
      const { databases } = await createAdminClient();
      try {
           await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avator: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXaPuCl6RTAl6PZC9ImLhrJLZFOX-eyb1a3w&s',
          accountId,
        },
      );
      } catch (error) {
        console.error("创建用户文档失败：", error);
        throw error;
      }
      
    //   await databases.createDocument(
    //     appwriteConfig.databaseId,
    //     appwriteConfig.usersCollectionId,
    //     ID.unique(),
    //     {
    //       fullName,
    //       email,
    //       avator: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
    //       accountId,
    //     },
    //   );
    }
  
    return parseStringify({ accountId });
  };

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async (email: string) => {
    console.log('Starting signInUser with email:', email);
    
    try {
      console.log('Checking if user exists...');
      const existingUser = await getUserByEmail(email);
      console.log('User lookup result:', existingUser);
  
      if (existingUser) {
        console.log('User found, sending OTP...');
        await sendEmailOTP({ email });
        console.log('OTP sent successfully');
        return { success: true, accountId: existingUser.accountId };
      }
  
      console.log('User not found');
      return { success: false, error: "User not found！！！！" ,email:email,existingUser:existingUser};
      
    } catch (error) {
      console.error('Error in signInUser:', error);
      return { success: false, error: "Failed to sign in user" ,email:email,err:error};
    }
  };

