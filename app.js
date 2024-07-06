let tg = window.Telegram.WebApp;

//tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let products = [
	{
		id: 1,
		name: "Чизбургер",
		price: "300"
	},
	{
		id: 2,
		name: "Бургер",
		price: "200"
	}
]

let ready = false;
let cart = [];


$('.btn').on('click', function () {
	var parent = $(this).parent();
	$(this).hide()
	parent.find('.price').show();
	parent.find('.counter').show()
	parent.find('.counter').text('1')
	var food = $(parent.find('.item-info')[0])
	var id = Number(food.attr('id').replace('food', ''))
	cart.push(
		{
			product: products.find(elem => elem.id == id),
			count: 1
		}
	)
	console.log(cart)

	$(document).trigger('checkCart')
})

$(document).on('checkCart', function () {
	if(cart.length == 0) {
		tg.MainButton.hide();
	} else {
		tg.MainButton.setText("Корзина")
		tg.MainButton.show();
	}
})

$('.plus').on('click', function () {
	var parent = $(this).parent().parent();
	var food = $(parent.find('.item-info')[0])
	var id = Number(food.attr('id').replace('food', ''))
	var product = updateCounter(id, 'plus')
	parent.find('.counter').text(product.count)
	console.log(cart)
})

$('.minus').on('click', function () {
	var parent = $(this).parent().parent();
	var food = $(parent.find('.item-info')[0])
	var id = Number(food.attr('id').replace('food', ''))
	var product = updateCounter(id, 'minus')
	if(product.count == 0) {
		cart = cart.filter(elem => elem.count != 0);
		$(parent.find('.counter')[0]).hide()
		$(parent.find('.price')[0]).hide();
		$(parent.find('.btn')[0]).show();
	} else {
		parent.find('.counter').text(product.count)
	}
	console.log(cart)
	$(document).trigger('checkCart')
})

function updateCounter(id, operator) {
	var product = cart.find(elem => elem.product.id == id)
	if(product)
		if(operator == 'plus')
			product.count++
		else
			product.count--;
	return product;
}

Telegram.WebApp.onEvent("mainButtonClicked", function(){
	if(ready)
		tg.sendData(JSON.stringify(cart));
	else {
		$('.container').hide()
		$('.cart').show();
		var cartContainer = $('.cart-container')
		var totalPrice = 0;
		cart.forEach(element => {
			totalPrice += (Number(element.product.price) * element.count)
			var div = $('<div class="cart-row">');
			var name = $(`<span><strong>${element.product.name}</strong></span>`)
			var count = $(`<span style="margin-left: 3px; color: #ebad5b;"><strong>${element.count}x</strong></span>`)
			var price = $(`<span style="margin-left: auto;"><strong>${Number(element.product.price) * element.count}₽</strong></span>`)
			div.append(name, count, price);
			cartContainer.append(div);
		});
		tg.MainButton.setText(`Итого ${totalPrice}₽`);
		cart.push({
			comment: $('.cart-comment').val()
		})
		ready = true;
	}
});

/*
let usercard = document.getElementById("usercard");

let p = document.createElement("p");

p.innerText = `${tg.initDataUnsafe.user.first_name}
${tg.initDataUnsafe.user.last_name}`;

usercard.appendChild(p);*/

$( document ).ready(function() {
    var products_container = $('.item-info');
	products_container.each(function () {
		products.forEach(product => {
			if($($(this)[0]).attr('id') == `food${product.id}`) {
				$($(this)[0]).find('.item-name').text(product.name);
				$($(this)[0]).find('.item-price').text(product.price + "₽")
			}
		});
	})
});







