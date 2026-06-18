import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { Colors, Spacing } from "@/src/constants/theme";
import { useProducts } from "@/src/contexts/ProductsContext";
import { produtoSchema, type ProdutoFormData } from "@/src/schemas/produtoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";

export default function NovoProduto() {
  const { adicionarProduto } = useProducts();

  const { control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ProdutoFormData>({
      resolver: zodResolver(produtoSchema),
      defaultValues: {
        nome: "", categoriaId: "", quantidade: 0,
        quantidadeMinima: 0, preco: 0, unidade: "un", observacao: "",
      },
    });

  const onSubmit = async (data: ProdutoFormData) => {
    await adicionarProduto(data);
    router.back();
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

      <Button label="Cadastrar produto"
        onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing[6], gap: Spacing[1], paddingBottom: Spacing[10] },
});