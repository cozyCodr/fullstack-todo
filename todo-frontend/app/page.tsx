"use client"

import React, { useState } from 'react'
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Signup } from '@/components'
import { useRouter } from 'next/navigation'
import { Spinner } from "@nextui-org/spinner"

type Props = {}

const Login = (props: Props) => {
  const { push } = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    try {
      setLoading(true);
      if (username.length > 0 && password.length > 0) {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        });

        if (response.ok) {
          push("/todos")
          console.log(await response.json())
        }
        else {
          console.log(await response.json())
          setLoading(false);
        }

      }
    }
    catch (error: any) {
      console.log(error.message)
    }
  }


  return (
    <>
      <div className='w-full h-full flex justify-center p-32'>
        <form className='flex flex-col gap-8 max-w-[400px] w-full' >
          <div className='w-full flex justify-center text-lg'>Welcome Back! Login</div>
          <div
            className='flex flex-col w-full gap-8'
          >
            <div className='flex flex-col w-full gap-4'>
              <Input
                variant='bordered'
                size='md'
                radius='sm'
                label="Username"
                labelPlacement='outside'
                placeholder='cre8tor'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <Input
                variant='bordered'
                size='md'
                radius='sm'
                label="Password"
                labelPlacement='outside'
                placeholder='*********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Button onPress={login} radius="sm" color="primary">Login</Button>
            </div>
            <div className=' flex w-full justify-center items-center'>
              Already have an account? <Signup />
            </div>
          </div>
        </form>
      </div>
      {
        loading && (
          <div className="fixed left-0 top-0 w-full h-screen bg-black/70 flex justify-center items-center">
            <Spinner color="white" />
          </div>
        )
      }
    </>
  )
}

export default Login