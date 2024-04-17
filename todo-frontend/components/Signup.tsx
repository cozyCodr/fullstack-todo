import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button"
import { Spinner } from "@nextui-org/spinner"

type Props = {
  loading: boolean;
  setLoading: (bool: boolean) => void
}

export default function Signup({ loading, setLoading }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function registerAccount() {
    try {
      setLoading(true);
      if (username.length > 0 && password.length > 0) {
        const response = await fetch("/api/register", {
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
          setLoading(false);
          setMessage("Account created. Login");
          setTimeout(() => {
            setMessage("");
            onClose();
          }, 1500)

        }
        else {
          const { message } = await response.json();
          throw new Error(message);
        }

      }
    }
    catch (error: any) {
      console.log(error.message)
      setMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      <p className="p-0 w-fit text-primary-400 ml-2 cursor-pointer" onClick={onOpen}>Create Account</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex justify-between w-fullgap-1">
                <p>Create Account</p>
                <p className="text-green-700 text-[12px]">{message}</p>
              </ModalHeader>
              <ModalBody>
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                  />
                </div>
                {
                  loading && (
                    <div className="fixed left-0 top-0 w-full h-screen bg-black/70 flex justify-center items-center">
                      <Spinner color="white" />
                    </div>
                  )
                }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={registerAccount}>
                  Register
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </>
  );
}
