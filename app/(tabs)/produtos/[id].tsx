import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { Colors, Spacing } from "@/src/constants/theme";
import { useProducts } from "@/src/contexts/ProductsContext";
import { produtoSchema, type ProdutoFormData } from "@/src/schemas/produtoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function EditarProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { editarProduto, deletarProduto, getProdutoById } = useProducts();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProdutoFormData>({
      resolver: zodResolver(produtoSchema),
      defaultValues: {
        nome: "", categoriaId: "", quantidade: 0,
        quantidadeMinima: 0, preco: 0, unidade: "un", observacao: "",
      },
    });

  useEffect(() => {
    if (id) {
      const produto = getProdutoById(id);
      if (produto) {
        reset({
          nome: produto.nome,
          categoriaId: produto.categoriaId,
          quantidade: produto.quantidade,
          quantidadeMinima: produto.quantidadeMinima,
          preco: produto.preco,
          unidade: produto.unidade as ProdutoFormData["unidade"],
          observacao: produto.observacao ?? "",
        });
      }
    }
  }, [id]);

  const onSubmit = async (data: ProdutoFormData) => {
    if (id) await editarProduto(id, data);
    router.back();
  };

  const handleDeletar = () => {
    Alert.alert(
      "Excluir produto",
      "Esta ação não pode ser desfeita. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (id) await deletarProduto(id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">

      <Controller control={control} name="nome"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Nome do produto *" value={value} onChangeText={onChange}
            onBlur={onBlur} error={errors.nome?.message}
            autoCapitalize="sentences" returnKeyType="next" />
        )}
      />

      <Controller control={control} name="categoriaId"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Categoria *" value={value} onChangeText={onChange}
            onBlur={onBlur} error={errors.categoriaId?.message}
            hint="ex: cat_1 (Bebidas), cat_2 (Alimentos), cat_3 (Limpeza)"
            returnKeyType="next" />
        )}
      />

      <Controller control={control} name="unidade"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Unidade *" value={value} onChangeText={onChange as any}
            onBlur={onBlur} error={errors.unidade?.message}
            hint="un, kg, cx, L ou m"
            returnKeyType="next" />
        )}
      />

      <Controller control={control} name="quantidade"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Quantidade em estoque *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t))}
            onBlur={onBlur} error={errors.quantidade?.message}
            keyboardType="numeric" returnKeyType="next" />
        )}
      />

      <Controller control={control} name="quantidadeMinima"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Quantidade mínima *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t))}
            onBlur={onBlur} error={errors.quantidadeMinima?.message}
            keyboardType="numeric" returnKeyType="next" />
        )}
      />

      <Controller control={control} name="preco"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Preço (R$) *"
            value={value === 0 ? "" : String(value)}
            onChangeText={(t) => onChange(t === "" ? 0 : Number(t.replace(",", ".")))}
            onBlur={onBlur} error={errors.preco?.message}
            keyboardType="decimal-pad" returnKeyType="next" />
        )}
      />

      <Controller control={control} name="observacao"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input label="Observação (opcional)" value={value ?? ""}
            onChangeText={onChange} onBlur={onBlur}
            error={errors.observacao?.message}
            returnKeyType="done" />
        )}
      />

      <Button label="Salvar alterações"
        onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />

      <View style={{ height: Spacing[3] }} />

      <Button label="Excluir produto"
        onPress={handleDeletar} variant="danger" fullWidth />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[6], gap: Spacing[1], paddingBottom: Spacing[10] },
});