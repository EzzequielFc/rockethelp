import { useState } from "react";
import auth from "@react-native-firebase/auth"
import { VStack, Heading, Input } from "native-base";

import Logo from "../assets/logo_primary.svg";

import { Button } from "../components/Button";
import { Alert } from "react-native";

export function SignInt() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn() {
    if(!email || !password) {
      return Alert.alert("Login", "Digite o e-mail e a senha!")
    }

    setIsLoading(true);

    auth().signInWithEmailAndPassword(email,password)
    .catch((error) => {
      console.log(error);
      setIsLoading(false);

      if(error.code === 'auth/invalid-email'){
        return Alert.alert("Entrar","Email ou senha invalido!");
      }
      
      if(error.code === 'auth/user-not-found'){
        return Alert.alert("Entrar","Usuario não cadastrado!");
      }

      return Alert.alert("Entrar", "Não foi possivel acessar!");
    })

    
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        bg="gray.700"
        h={14}
        size="md"
        borderWidth={0}
        fontSize="md"
        fontFamily="body"
        color="white"
        placeholderTextColor="gray.300"
        placeholder="E-mail"
        _focus={{
          borderWidth: 1,
          borderColor: "green.500",
          bg: "gray.700",
        }}
        mb={4}
        onChangeText={setEmail}
      />

      <Input
        bg="gray.700"
        h={14}
        size="md"
        borderWidth={0}
        fontSize="md"
        fontFamily="body"
        color="white"
        placeholderTextColor="gray.300"
        placeholder="Senha"
        _focus={{
          borderWidth: 1,
          borderColor: "green.500",
          bg: "gray.700",
        }}
        mb={4}
        onChangeText={setPassword}
      />

      <Button title="Entrar" w="full" onPress={handleSignIn} isLoading={isLoading}/>
    </VStack>
  );
}
