'use client';

import CorrespondencesTab from './CorrespondencesTab';
import LettersTab from './LettersTab';
import React, { useEffect, useState } from 'react';
import RecipientsTab from './RecipientsTab';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { Tab, TabList, TabPanel, TabPanels, TabGroup } from '@headlessui/react';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button, TextInput } from '@components/Form';

const tabs = [
  {
    createRoute: '/admin/correspondence',
    key: 'correspondences',
    label: 'Correspondences',
    placeholder: 'Search by title or recipient…',
  },
  {
    createRoute: '/admin/letter',
    key: 'letters',
    label: 'Letters',
    placeholder: 'Search letter text or title…',
  },
  {
    createRoute: '/admin/recipient',
    key: 'recipients',
    label: 'Recipients',
    placeholder: 'Search by name or organization…',
  },
];

const Admin = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const tabParam = searchParams.get('tab');
  const initialTabIndex = Math.max(
    tabs.findIndex((t) => t.key === tabParam),
    0,
  );

  const [selectedIndex, setSelectedIndex] = useState(initialTabIndex);
  const [search, setSearch] = useState('');

  const { isLoggedIn, loading: authenticating, token } = useAuth();

  const activeTab = tabs[selectedIndex];

  useEffect(() => {
    if (!isLoggedIn && !authenticating) {
      router.push('/forbidden');
    }
  }, [authenticating, isLoggedIn, router]);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    const newTab = tabs[index].key;
    const newUrl = `${pathname}?tab=${newTab}`;
    router.replace(newUrl);
  };

  const handleCreateClick = () => {
    router.push(activeTab.createRoute);
  };

  return (
    <div className="flex-1 flex w-full h-full text-white font-merriweather min-h-screen">
      <div className="w-full py-4 px-4 flex flex-col h-full">
        <div className="sm:hidden mb-6 sm:mb-4">
          <label htmlFor="tab-select" className="sr-only">
            Select a section
          </label>
          <div className="relative w-full">
            <select
              id="tab-select"
              value={selectedIndex}
              onChange={(e) => handleTabChange(Number(e.target.value))}
              className="w-full h-12 rounded-full bg-white/25 border border-white text-white text-base placeholder-white/70 px-4 pr-10 focus:outline-none appearance-none"
            >
              {tabs.map((tab, idx) => (
                <option key={tab.key} value={idx} className="text-black">
                  {tab.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-3.5 text-white">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
        <TabGroup selectedIndex={selectedIndex} onChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
            <TabList className="hidden sm:flex space-x-2 border-b border-white">
              {tabs.map((tab) => (
                <Tab
                  className={`px-4 py-2 font-semibold text-lg rounded-t-md transition
                    ${
                      tab.key === tabs[selectedIndex].key
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  key={tab.key}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
            <div className="w-full sm:w-1/4 md:w-1/6 lg:w-1/8 xl:w-1/12">
              <Button
                value="Create New"
                id="admin-create-new-button"
                onClick={handleCreateClick}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="relative w-full">
              <TextInput
                data-testid="admin-search"
                IconStart={Search}
                id="admin-search-input"
                onChange={(e) => setSearch(e.target.value)}
                placeholder={activeTab.placeholder}
                type="text"
                value={search}
              />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <TabPanels className="h-full">
              <TabPanel className="h-full">
                <CorrespondencesTab token={token} />
              </TabPanel>
              <TabPanel className="h-full">
                <LettersTab token={token} />
              </TabPanel>
              <TabPanel className="h-full">
                <RecipientsTab token={token} />
              </TabPanel>
            </TabPanels>
          </div>
        </TabGroup>
      </div>
    </div>
  );
};

export default Admin;
