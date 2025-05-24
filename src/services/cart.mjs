//quais açoes meu carrinho pode fazer

//-> adicionar item no carrinho
async function addItem(userCart, item){
userCart.push(item);
}

//-> deletar item do carrinho

async function deleteItem(userCart, name){
    const index = userCart.findIndex((item) => item.name === name);

    if(index !== -1){
        userCart.splice(index, 1);
    }
}

//-> remover um item do carrinho - diminui um item
async function removeItem(userCart, item){
    const indexFound = userCart.findIndex((p) => p.name === item.name);
    
    // caso nao encontre o item
    if (indexFound == -1){
        console.log("Item not found in the cart");
        return;
    }

    // item > 1 subtrair um item, item =1 deletar o item
    if(userCart[indexFound].quantity > 1){
        userCart[indexFound].quantity -= 1;
        //atualiza o subtotal do item junto com a quantidade
        userCart[indexFound].subtotal = function(){
            return this.price * this.quantity;
        }
    }

    // caso item = 1 deletar o item
    if(userCart[indexFound].quantity == 1){
        userCart.splice(indexFound, 1);
        return;
    }
}

async function displayCart(userCart){
    console.log("\nLista do carrinho da Shopee:");
    userCart.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - R$ ${item.price} | ${item.quantity}x | Subtotal: R$ ${item.subtotal()}`);
    })
}

//-> calcular o total do carrinho
async function calculateTotal(userCart){
const result = userCart.reduce((total, item) => total + item.subtotal(), 0);
console.log(`🤑 TOTAL 🤑: R$ ${result}`);
}

export {
    addItem,
    calculateTotal,
    deleteItem,
    removeItem,
    displayCart
}