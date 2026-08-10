'use client';

import React, { useState } from 'react';
import { Button, TextInput } from '@components/Form';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { LoginForm } from '@ts-types/login';
import {
  defaultLoginError,
  initialLoginValues,
  loginValidators,
} from '@constants/login';
import { useAuth } from '@contexts/AuthProvider';
import { useForm } from '@hooks/useForm';
import { useRouter } from 'next/navigation';

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
  } = useForm<LoginForm>({
    initial: initialLoginValues,
    validators: loginValidators,
  });

  const handleFieldChange = (field: keyof LoginForm, value: string) => {
    setNetworkError('');
    updateField(field, value);
  };

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
        console.error('[auth] Login signIn failed', error);
        const msg = (error as Error).message || defaultLoginError;
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
    <div className="p-4 flex justify-center items-center md:pt-16 md:pb-16">
      <div className="w-full sm:w-full sm-tablet:w-4/5 md-tablet:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 flex flex-col justify-center items-center space-y-4">
        <h1 className="self-start text-white text-3xl font-semibold">Login</h1>
        <form
          className="w-full flex flex-col justify-center items-center space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSignIn();
          }}
        >
          <TextInput
            IconStart={User}
            autocomplete="username"
            errors={inputErrors.username}
            id="username-text-input"
            label="Username"
            onChange={({ target: { value } }) =>
              handleFieldChange('username', value)
            }
            placeholder="Username"
            type="text"
            value={values.username}
          />
          <TextInput
            IconEnd={isPasswordVisible ? EyeOff : Eye}
            IconStart={Lock}
            autocomplete="current-password"
            errors={inputErrors.password}
            iconEndLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            id="password-text-input"
            label="Password"
            onChange={({ target: { value } }) =>
              handleFieldChange('password', value)
            }
            onIconEndClick={toggleVisibility}
            placeholder="Password"
            type={isPasswordVisible ? 'text' : 'password'}
            value={values.password}
          />
          {networkError && (
            <div
              aria-live="assertive"
              className="w-full text-red-400 text-base"
              id="login-network-error"
              role="alert"
            >
              {networkError}
            </div>
          )}
          <div className="w-full pt-2 space-y-5">
            <Button
              disabled={
                !isValid || !isDirty || Object.keys(inputErrors).length > 0
              }
              htmlType="submit"
              id="sign-in-submit-button"
              loading={loading}
              value="Sign In"
            />
            <Button
              htmlType="button"
              id="cancel-button"
              onClick={handleCancel}
              value="Cancel"
            />
          </div>
        </form>

        {isLoggedIn && (
          <div className="flex justify-end w-full text-md -translate-y-1">
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:cursor-pointer hover:text-white border-b border-transparent hover:border-white transition"
              type="button"
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
