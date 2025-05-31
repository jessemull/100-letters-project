import Fuse from 'fuse.js';
import { Letter, View } from './letter';
import { SearchType } from './search';
import { SWRConfiguration } from 'swr';

export type UseDeleteUpload = {
  letter: Letter;
  token: string | null;
};

export type DeleteFile = {
  imageId: string;
};

export type UseFileUpload = {
  caption?: string;
  letter: Letter;
  token: string | null;
  view: View;
};

export type FuseMap = Record<SearchType, Fuse<any>>;

export type Method = 'POST' | 'PUT' | 'DELETE';

export type Cache<Body, Params, Response = unknown> = {
  key: string;
  onUpdate?: (args: {
    key: string;
    prev: unknown;
    body?: Body;
    params?: Params;
    response?: Response;
  }) => unknown;
};

export type UseAuthorizedMutationOptions<Body, Response, Params> = {
  cache?: Cache<Body, Params, Response>[];
  method?: Method;
  token?: string | null;
  path?: string;
  url?: string;
  onError?: (args: {
    error: string;
    status?: number;
    info?: any;
    path: string;
    body?: Body;
    params?: Params;
  }) => void;
  onSuccess?: (args: {
    response: Response;
    path: string;
    body?: Body;
    params?: Params;
  }) => void;
};

export type MutateArgs<Body, Params> = {
  path?: string;
  body?: Body;
  params?: Params;
  headers?: HeadersInit;
  url?: string;
};

export type UseSWRQueryOptions<T> = {
  config?: SWRConfiguration;
  merge?: (prev: unknown | null, page: unknown) => T;
  path: string | null;
  skip?: boolean;
  token: string | null;
};
