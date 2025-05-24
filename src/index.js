import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import createItem from "./services/item.mjs";
import * as cartService from "./services/cart.mjs";
import fs from "fs/promises";


const rl = readline.createInterface({ input, output });
const userName = await rl.question("Qual seu nome?: ");
console.log(`\n😁 Olá ${userName}, bem-vindo ao seu carrinho Shopee!`);
console.log("Você pode adicionar itens ao seu carrinho, removê-los e calcular o total.");


//função para criar um item interativamente
async function createItemFromUserInput() {
    const name = await rl.question("Digite o nome do item: ");
    const price = parseFloat(await rl.question("Digite o preço do item: "));
    const quantity = parseInt(await rl.question("Digite a quantidade do item: "), 10);
    return await createItem(name, price, quantity);
}

const myCart = [];
const myWhishList = [];

//loop cria item com perguntas ao usuario
let adicionarMais=true;
while(adicionarMais){
const item = await createItemFromUserInput();

let destino = await rl.question("\n🤔 Você deseja adicionar o item ao carrinho ou à lista de desejos? (carrinho/desejos): ");
destino = destino.trim().toLowerCase();

if (destino === "desejos" || destino === "lista de desejos" || destino === "wish" || destino === "wishlist") {
    myWhishList.push(item);
    console.log(`Item ${item.name} adicionado à lista de desejos.`);
} else {
    await cartService.addItem(myCart, item);
    console.log(`Item ${item.name} adicionado ao carrinho.`);
}

//pergunta se o usuario quer adicionar mais itens
let resposta = await rl.question("\n🤓 Deseja adicionar mais algum item? (sim/não): ");
resposta = resposta.trim().toLowerCase();
if(resposta !== "sim" && resposta !== "s"){
    adicionarMais = false;
}
}

// exibe o carrinho
await cartService.displayCart(myCart);


console.log("\n📱 O Total do seu carrinho da Shoppe é:");
await cartService.calculateTotal(myCart);

//exibe a lista de desejos
if(myWhishList.length > 0){
    console.log("\n🤩Lista de desejos:");
    myWhishList.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - R$ ${item.price} | ${item.quantity}x | Subtotal: R$ ${item.subtotal()}`);
    });
} else {
    console.log("😪Sua lista de desejos está vazia.😪");
}
//pergunta se o usuario quer remover algum item do carrinho
let remover = await rl.question("\n😢 Você deseja remover algum item do carrinho ou da lista de desejos? (carrinho/desejos/nenhum): ");
remover = remover.trim().toLowerCase();

if(remover === "carrinho"){
    const nomeRemover = await rl.question("Qual item você deseja remover do carrinho? ");
    await cartService.deleteItem(myCart, nomeRemover);
    console.log("\n🗑️Item removido do carrinho.");
    await cartService.displayCart(myCart);
    await cartService.calculateTotal(myCart);

}else if(remover === "desejos"){
    const nomeRemover = await rl.question("Qual item você deseja remover da lista de desejos? ");
    const index = myWhishList.findIndex((item) => item.name === nomeRemover);

    if(index !== -1){
        myWhishList.splice(index, 1);
        console.log("\n🗑️Item removido da lista de desejos.");

     if (myWhishList.length > 0){
        myWhishList.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name} - R$ ${item.price} | ${item.quantity}x | Subtotal: R$ ${item.subtotal()}`);
        });

    } else {
        console.log("😪Sua lista de desejos está vazia.😪");

    } 
    } else {
        console.log("😪Item não encontrado na lista de desejos.😪");
    }
    
    }

//pergunta se deseja salvar a lista
let salvar= await rl.question("\n💾Você deseja salvar a sua lista em um arquivo? (sim/não): ");
salvar = salvar.trim().toLowerCase();
if(salvar === "sim" || salvar === "s"){
    let conteudo = "Carrinho da Shopee:\n";
    myCart.forEach((item, index) => {
        conteudo += `${index + 1}. ${item.name} - R$ ${item.price} | ${item.quantity}x | Subtotal: R$ ${item.subtotal()}\n`;
    });
    if (myWhishList.length > 0){
        conteudo += "\nLista de desejos:\n";
        myWhishList.forEach((item, index) => {
            conteudo += `${index + 1}. ${item.name} - R$ ${item.price} | ${item.quantity}x | Subtotal: R$ ${item.subtotal()}\n`;
        });
    }
    await fs.writeFile("lista_shopee.txt", conteudo, "utf-8");
    console.log("📝Lista salva com sucesso, como lista_shopee.txt!");
}
rl.close();