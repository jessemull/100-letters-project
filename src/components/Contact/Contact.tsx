'use client';

import ReCAPTCHA from 'react-google-recaptcha';
import React, { useState } from 'react';
import { Button, TextArea, TextInput } from '@components/Form';
import { ContactForm, ContactFormBody, ContactFormResponse } from '../../types';
import { isEmail, maxLength, required } from '@util/validators';
import { useForm } from '@hooks/useForm';
import { useRouter } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string;

const background = `linear-gradient( rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75) ), url('/signin.webp')`;

const defaultErrorMessage = 'Something went wrong! Please try again.';

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

const validators = {
  firstName: [required('Please enter a first name')],
  lastName: [required('Please enter a last name')],
  email: [
    required('Please enter an e-mail address'),
    isEmail('Please enter a valid e-mail address'),
  ],
  message: [
    required('Please enter a message'),
    maxLength(1500, 'Length must be less than 1500 characters'),
  ],
};

const Contact = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const { errors, isDirty, onSubmit, updateField, values } =
    useForm<ContactForm>({ initial, validators });

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
      setCaptchaToken(null);
    },
  });

  const handleSubmit = async () => {
    if (!captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    onSubmit(async () => {
      try {
        await mutate(
          { ...values },
          {
            'g-recaptcha-response': captchaToken,
          },
        );
      } catch (e) {
        setError(defaultErrorMessage);
      }
    });
  };

  const goHome = () => {
    router.push('/');
  };

  const handleCaptchaToken = (token: string | null) => {
    setCaptchaToken(token);
    setError('');
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
            errors={errors.firstName || undefined}
            id="firstName"
            onChange={({ target: { value } }) =>
              updateField('firstName', value)
            }
            placeholder="First Name"
            type="text"
            value={values.firstName}
          />
          <TextInput
            errors={errors.lastName || undefined}
            id="lastName"
            onChange={({ target: { value } }) => updateField('lastName', value)}
            placeholder="Last Name"
            type="text"
            value={values.lastName}
          />
          <TextInput
            errors={errors.email ? errors.email[0] : undefined}
            id="email"
            onChange={({ target: { value } }) => updateField('email', value)}
            placeholder="Email"
            type="email"
            value={values.email}
          />
          <TextArea
            errors={error || errors.message || undefined}
            id="message"
            onChange={({ target: { value } }) => updateField('message', value)}
            placeholder="Write your message here..."
            value={values.message}
          />
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={CAPTCHA_SITE_KEY}
              onChange={(token) => handleCaptchaToken(token)}
              className="mt-[-6px]"
            />
          </div>
          <div className="flex flex-col xl:flex-row xl:flex-row-reverse gap-4 xl:justify-between">
            <div className="w-full">
              <Button
                disabled={!isDirty || loading || Object.keys(errors).length > 0}
                id="contact-submit"
                loading={loading}
                onClick={handleSubmit}
                value="Submit"
              />
            </div>
            <div className="w-full">
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
