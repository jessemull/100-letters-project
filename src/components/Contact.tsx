'use client';

import Button from './Button';
import React, { useState } from 'react';
import TextArea from './TextArea';
import TextInput from './TextInput';
import { useSWRMutation } from '../hooks';
import { useRouter } from 'next/navigation';
import { ContactFormBody, ContactFormResponse } from 'src/types';

const MAX_NAME_LENGTH = 64;
const MAX_MESSAGE_LENGTH = 1500;

const background = `linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) ), url('/signin.webp')`;

const defaultErrorMessage = 'Something went wrong! Please try again.';

const Contact = () => {
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const { mutate, loading } = useSWRMutation<
    ContactFormBody,
    ContactFormResponse
  >('/contact', {
    method: 'POST',
    onError: () => {
      setError(defaultErrorMessage);
    },
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const onChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      const next = { ...errors };
      delete next[field];
      setErrors(next);
    };

  const validate = () => {
    const newErrors: Record<string, string | null> = {};
    const { firstName, lastName, email, message } = formData;

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    else if (firstName.length > MAX_NAME_LENGTH)
      newErrors.firstName = 'Too long';

    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (lastName.length > MAX_NAME_LENGTH) newErrors.lastName = 'Too long';

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      newErrors.email = 'Invalid email';

    if (!message.trim()) newErrors.message = 'Message is required';
    else if (message.length > MAX_MESSAGE_LENGTH)
      newErrors.message = 'Too long';

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      await mutate(formData);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (e) {
      setError(defaultErrorMessage);
    }
  };

  const goHome = () => {
    router.push('/');
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
      {success ? (
        <div className="w-3/4 flex flex-col items-center justify-center space-y-4 md:space-y-6">
          <p className="w-full text-white text-xl text-center">
            {`Thanks for your message! We'll be in touch soon.`}
          </p>
          <div className="w-1/2 lg:w-1/4 xl:w-1/6">
            <Button id="contact-back" onClick={goHome} value="Back" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-6">
          <h1 className="text-white text-3xl font-semibold">Contact Us</h1>
          <TextInput
            id="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={onChange('firstName')}
            errors={errors.firstName || undefined}
          />
          <TextInput
            id="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={onChange('lastName')}
            errors={errors.lastName || undefined}
          />
          <TextInput
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange('email')}
            errors={errors.email || undefined}
          />
          <TextArea
            id="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={onChange('message')}
            errors={error || errors.message || undefined}
          />
          <div className="flex flex-col xl:flex-row xl:flex-row-reverse gap-4 xl:justify-between">
            <div className="w-full xl:w-1/3">
              <Button
                disabled={loading || Object.keys(errors).length > 0}
                id="contact-submit"
                loading={loading}
                onClick={onSubmit}
                value="Submit"
              />
            </div>
            <div className="w-full xl:w-1/3">
              <Button
                disabled={loading}
                id="contact-cancel"
                onClick={goHome}
                value="Cancel"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
