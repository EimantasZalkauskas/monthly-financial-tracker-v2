import { supabase } from './supabase';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

type SignupResult = {
  confirmationRequired: boolean;
};

export async function createUser(user: CreateUserInput): Promise<SignupResult> {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: { name: user.name },
    },
  });

  if (error) {
    if (
      error.status === 429 ||
      error.message.toLowerCase().includes('email rate limit exceeded')
    ) {
      throw new Error(
        'Signup emails are temporarily rate-limited. Wait for the limit to reset before trying again. For development, configure a custom SMTP provider or use local Supabase Auth with Mailpit.',
      );
    }

    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Supabase did not return a user after signup.');
  }

  return { confirmationRequired: data.session === null };
}

export async function signInUser(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }
}
