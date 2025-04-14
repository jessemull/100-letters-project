'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Correspondence,
  GetCorrespondencesResponse,
} from '@ts-types/correspondence';
import {
  CorrespondenceItem,
  LetterItem,
  RecipientItem,
} from '@components/Admin';
import { GetLettersResponse, Letter } from '@ts-types/letter';
import { GetRecipientsResponse, Recipient } from '@ts-types/recipients';
import { Progress } from '@components/Form';
import { Search } from 'lucide-react';
import { Tab, TabList, TabPanel, TabPanels, TabGroup } from '@headlessui/react';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import { useSWRQuery } from '@hooks/useSWRQuery';

interface TabDefinition<T> {
  data: T[];
  key: string;
  label: string;
  placeholder: string;
  ItemComponent: React.ComponentType<{
    data: T;
  }>;
}

const Admin = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState('');

  const { isLoggedIn, loading: authenticating, token } = useAuth();

  const { data: correspondencesData, isLoading: loadingCorrespondences } =
    useSWRQuery<GetCorrespondencesResponse>('/correspondence', token);

  const { data: recipientsData, isLoading: loadingLetters } =
    useSWRQuery<GetRecipientsResponse>('/recipient', token);

  const { data: lettersData, isLoading: loadingRecipients } =
    useSWRQuery<GetLettersResponse>('/letter', token);

  const tabs: [
    TabDefinition<Correspondence>,
    TabDefinition<Letter>,
    TabDefinition<Recipient>,
  ] = useMemo(
    () => [
      {
        ItemComponent: CorrespondenceItem,
        data: correspondencesData?.data || [],
        key: 'correspondences',
        label: 'Correspondences',
        placeholder: 'Search by title or recipient…',
      },
      {
        ItemComponent: LetterItem,
        data: lettersData?.data || [],
        key: 'letters',
        label: 'Letters',
        placeholder: 'Search letter text or title…',
      },
      {
        ItemComponent: RecipientItem,
        data: recipientsData?.data || [],
        key: 'recipients',
        label: 'Recipients',
        placeholder: 'Search by name or organization…',
      },
    ],
    [correspondencesData, lettersData, recipientsData],
  );

  const activeTab = tabs[selectedIndex];

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && !authenticating) {
      router.push('/forbidden');
    }
  }, [authenticating, isLoggedIn, router]);

  return (
    <div className="p-4 bg-fixed bg-center bg-[repeating-linear-gradient(45deg,_blue_0,_blue_16px,_red_16px,_red_32px,_white_32px,_white_48px)] min-h-screen w-full">
      <div className="flex w-full bg-white text-gray-800 font-merriweather min-h-[calc(100vh-16px)]">
        <div className="w-full py-4 px-4">
          <div className="sm:hidden mb-6 sm:mb-4">
            <label htmlFor="tab-select" className="sr-only">
              Select a section
            </label>
            <select
              className="w-full pl-3 pr-3 py-3 rounded-xl border border-black shadow-sm bg-white font-bold appearance-none"
              id="tab-select"
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              value={selectedIndex}
            >
              {tabs.map((tab, idx) => (
                <option key={tab.key} value={idx}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
          <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <TabList className="hidden sm:flex space-x-2 mb-6 border-b border-black">
              {tabs.map((tab) => (
                <Tab
                  className={`px-4 py-2 font-semibold text-lg transition ${
                    tab.key === tabs[selectedIndex].key
                      ? 'font-bold'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                  key={tab.key}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
            <div className="mb-6">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5"
                  strokeWidth={3}
                />
                <input
                  data-testid="admin-search"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-black shadow-lg bg-white placeholder-gray-500 text-md"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={activeTab.placeholder}
                  type="text"
                  value={search}
                />
              </div>
            </div>
            {loadingCorrespondences || loadingLetters || loadingRecipients ? (
              <div className="w-full flex-grow flex items-center justify-center py-24 min-h-[calc(100vh-475px)]">
                <Progress size={16} />
              </div>
            ) : (
              <TabPanels>
                {tabs.map(({ ItemComponent, data, key }) => (
                  <TabPanel key={key}>
                    <ul className="grid gap-4">
                      {data.map((item, idx) => (
                        <li key={idx}>
                          <ItemComponent data={item as any} />
                        </li>
                      ))}
                      {data.length === 0 && (
                        <li className="text-center text-gray-500">
                          No results found.
                        </li>
                      )}
                    </ul>
                  </TabPanel>
                ))}
              </TabPanels>
            )}
          </TabGroup>
        </div>
      </div>
    </div>
  );
};

export default Admin;
