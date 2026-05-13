import { supabase } from './supabaseClient';
import { validateSignupForm, validateLoginForm } from './validationService';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  studentId: string;
  studentEmail: string;
}

export interface SignupData extends AuthCredentials, UserProfile {
  confirmPassword?: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(data: SignupData) {
  try {
    // 验证表单数据
    const validation = validateSignupForm({
      firstName: data.firstName,
      lastName: data.lastName,
      studentId: data.studentId,
      studentEmail: data.studentEmail,
      password: data.password,
      confirmPassword: data.confirmPassword
    });

    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Create auth user
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!user) throw new Error('User creation failed');

    // Create user profile in public.users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          student_id: data.studentId,
          student_email: data.studentEmail,
          email: data.email,
          created_at: new Date().toISOString(),
        }
      ]);

    if (profileError) throw profileError;

    return { success: true, user };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

/**
 * Sign in a user with email and password
 */
export async function signIn(credentials: AuthCredentials) {
  try {
    // 验证登录表单
    const validation = validateLoginForm(credentials);

    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current user session
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Get current user profile
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}
