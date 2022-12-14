import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { SignOut, ChatTeardropText } from "phosphor-react-native";
import { Loading } from "../components/Loading";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import { Order, OrderProps } from "../components/Order";
import Logo from "../assets/logo_secondary.svg";
import { dateFormat } from "../utils/firestoreDateFormat";
import { isLoaded } from "expo-font";

export function Home() {
  const [loading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate("new");
  }

  function handleOpenDatails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleLogout() {
    auth().signOut();
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });
        setOrders(data);
        setIsLoading(false);
      });

    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100"> Meus chamados</Heading>
          <Text color="gray.200">3</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="em andamento"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            type="closed"
            title="finalizados"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>

        {loading ? (
          <Loading />
        ) : (
          <FlatList
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Voc?? ainda n??o possui {"\n"} solicita????es{" "}
                  {statusSelected === "open" ? "em andamento" : "finalizadas"}
                </Text>
              </Center>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDatails(item.id)} />
            )}
          />
        )}

        <Button title="Nova solicita????o" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
