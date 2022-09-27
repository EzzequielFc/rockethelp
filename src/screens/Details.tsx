import { Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { OrderProps } from "../components/Order";
import firestore from "@react-native-firebase/firestore";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dateFormat } from "../utils/firestoreDateFormat";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        });

        setIsLoading(false);
      });
  });
  return (
    <VStack flex={1} bg="gray.700">
      <Header title="solicitação" />
    </VStack>
  );
}
