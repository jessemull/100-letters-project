'use client';

import Button from './Button';
import React, { useEffect, useState } from 'react';
import TextInput from './TextInput';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { LoginForm } from '../types';
import { maxLength, required } from '../util';
import { useAuth } from '../contexts/AuthProvider';
import { useForm } from '../hooks/useForm';
import { useRouter } from 'next/navigation';

const DEFAULT_ERROR_MESSAGE = 'Error signing in. Please try again.';

const background = `linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) ), url('/signin.webp')`;

const initial = {
  password: '',
  username: '',
};

const validators = {
  password: [
    required('Please enter a password'),
    maxLength(150, 'Maximum password length exceeded'),
  ],
  username: [
    required('Please enter a user name'),
    maxLength(150, 'Maximum user name length exceeded'),
  ],
};

const Login = () => {
  const [networkError, setNetworkError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { isLoggedIn, signIn, signOut } = useAuth();

  const {
    errors: inputErrors,
    isValid,
    isDirty,
    onSubmit,
    updateField,
    values,
  } = useForm<LoginForm>({ initial, validators });

  useEffect(() => {
    setNetworkError('');
  }, [values]);

  const handleCancel = () => {
    router.push('/');
  };

  const handleSignIn = () => {
    const { password, username } = values;
    onSubmit(async () => {
      try {
        setNetworkError('');
        setLoading(true);
        await signIn(username, password);
        router.push('/');
      } catch (error) {
        const msg = (error as Error).message || DEFAULT_ERROR_MESSAGE;
        setNetworkError(msg);
      } finally {
        setLoading(false);
      }
    });
  };

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div
      className="p-8 flex items-center justify-center items-center w-full h-full min-h-[calc(100vh-110px)]"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: background,
      }}
    >
      <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/5 flex flex-col justify-center items-center space-y-6">
        <TextInput
          IconStart={Lock}
          errors={inputErrors.username}
          id="username-text-input"
          onChange={({ target: { value } }) => updateField('username', value)}
          placeholder="Username"
          type="text"
          value={values.username}
        />
        <TextInput
          IconEnd={isPasswordVisible ? EyeOff : Eye}
          IconStart={User}
          errors={inputErrors.password}
          id="password-text-input"
          onChange={({ target: { value } }) => updateField('password', value)}
          onIconEndClick={toggleVisibility}
          placeholder="Password"
          type={isPasswordVisible ? 'text' : 'password'}
          value={values.password}
        />
        {networkError && (
          <div className="w-full text-red-400 text-base">{networkError}</div>
        )}
        <Button
          disabled={!isValid || !isDirty || Object.keys(inputErrors).length > 0}
          id="sign-in-submit-button"
          loading={loading}
          onClick={handleSignIn}
          value="Sign In"
        />
        <Button id="cancel-button" onClick={handleCancel} value="Cancel" />
        {isLoggedIn && (
          <div className="flex justify-end w-full text-md -translate-y-1">
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:cursor-pointer hover:text-white border-b border-transparent hover:border-white transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
