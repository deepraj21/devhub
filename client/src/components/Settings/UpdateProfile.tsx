import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { Icons } from "@/components/ui/icons";
import UploadComponent from '@/components/UploadComponent/UploadComponent';
import { ScrollArea } from "@/components/ui/scroll-area"

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProfileData {
  name: string;
  bio: string;
  location: string;
  githubUsername: string;
  leetcodeUsername: string;
  profileImage?: File | null; 
}

const UpdateProfile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    bio: '',
    location: '',
    githubUsername: '',
    leetcodeUsername: '',
    profileImage: null 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('devhub_username');
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        try {
          const response = await axios.get(`${backendUrl}/profile/${username}`);
          setProfileData(response.data);
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
        }
      }
    };

    fetchProfile();
  }, [username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData: ProfileData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File) => {
    setProfileData((prevData: ProfileData) => ({
      ...prevData,
      profileImage: file,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!username) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('bio', profileData.bio);
    formData.append('location', profileData.location);
    formData.append('githubUsername', profileData.githubUsername);
    formData.append('leetcodeUsername', profileData.leetcodeUsername);
    if (profileData.profileImage) {
      formData.append('profileImage', profileData.profileImage); // Append the image file
    }

    try {
      await axios.put(`${backendUrl}/profile/${username}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure multipart form data
        },
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please check your details and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=' mt-4 grid gap-6 sm:w-80'>
      <h2 className='text-xl font-semibold dark:text-neutral-100'>
        Update Profile
      </h2>
      <form onSubmit={handleSubmit} className='grid gap-4'>
        <ScrollArea className='h-60 overflow-y-auto p-2'>
          <div className='p-2'>
            <Label htmlFor='profileImage' className='dark:text-neutral-200 mb-1'>
              Profile Image
            </Label>
            <UploadComponent onFileChange={handleFileChange} />
          </div>
          <div className='p-2'>
            <Label htmlFor='name' className='dark:text-neutral-200'>
              Name
            </Label>
            <Input
              id='name'
              name='name'
              value={profileData.name || ''}
              onChange={handleChange}
              disabled={isLoading}
              placeholder='Your name'
              className='mt-1'
            />
          </div>
          <div className='p-2'>
            <Label htmlFor='bio' className='dark:text-neutral-200'>
              Bio
            </Label>
            <Textarea
              id='bio'
              name='bio'
              value={profileData.bio || ''}
              onChange={handleChange}
              disabled={isLoading}
              placeholder='Write something about yourself'
              className='mt-1'
            />
          </div>
          <div className='p-2'>
            <Label htmlFor='location' className='dark:text-neutral-200'>
              Location
            </Label>
            <Input
              id='location'
              name='location'
              value={profileData.location || ''}
              onChange={handleChange}
              disabled={isLoading}
              placeholder='Your location'
              className='mt-1'
            />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 p-2'>
            <div>
              <Label htmlFor='githubUsername' className='dark:text-neutral-200'>
                GitHub
              </Label>
              <Input
                id='githubUsername'
                name='githubUsername'
                value={profileData.githubUsername || ''}
                onChange={handleChange}
                disabled={isLoading}
                placeholder='GitHub username'
                className='mt-1'
              />
            </div>
            <div>
              <Label htmlFor='leetcodeUsername' className='dark:text-neutral-200'>
                Leetcode
              </Label>
              <Input
                id='leetcodeUsername'
                name='leetcodeUsername'
                value={profileData.leetcodeUsername || ''}
                onChange={handleChange}
                disabled={isLoading}
                placeholder='Leetcode username'
                className='mt-1'
              />
            </div>
          </div>
        </ScrollArea>
        <Button type='submit' disabled={isLoading} className='w-full mt-4'>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> 'Updating...'
            </>
          ) : 'Update Profile'}
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
