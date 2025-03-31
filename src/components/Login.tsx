'use client';

import Button from './Button';
import React, { useState } from 'react';
import TextInput from './TextInput';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'src/contexts/AuthProvider';

const DEFAULT_ERROR_MESSAGE = 'Error signing in. Please try again.';

const background = `linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) ), url('/signin.webp')`;

const Login = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const router = useRouter();
  const { signIn } = useAuth();

  const handleCancel = () => {
    router.push('/');
  };

  const handleSignIn = async () => {
    try {
      setErrors([]);
      setLoading(true);
      await signIn(username, password);
      router.push('/');
    } catch (error) {
      const msg = (error as Error).message || DEFAULT_ERROR_MESSAGE;
      setErrors([msg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div
      className="p-8 flex justify-center items-center w-full"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: background,
        height: 'calc(100vh - 56px - 36px)',
      }}
    >
      <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/5 flex flex-col justify-center items-center space-y-6">
        <TextInput
          IconStart={Lock}
          id="username-text-input"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          type="text"
          value={username}
        />
        <TextInput
          IconEnd={isPasswordVisible ? EyeOff : Eye}
          IconStart={User}
          errors={errors}
          id="password-text-input"
          onChange={(e) => setPassword(e.target.value)}
          onIconEndClick={toggleVisibility}
          placeholder="Password"
          type={isPasswordVisible ? 'text' : 'password'}
          value={password}
        />
        <Button
          disabled={!username || !password}
          id="sign-in-submit-button"
          loading={loading}
          onClick={handleSignIn}
          value="Sign In"
        />
        <Button id="cancel-button" onClick={handleCancel} value="Cancel" />
      </div>
    </div>
  );
};

export default Login;
