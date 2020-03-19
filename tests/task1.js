const chai = require('chai');
const expect = chai.expect;
const os = require('os');
const { addEnvironment, addStep } = require('@wdio/allure-reporter').default;

describe('Test Beeline Shop', function() {
	before(() => {
		addStep('Get Enviroment');
		addEnvironment('OS', `${os.platform} ${os.release}`);
		const browserName = browser.capabilities.browserName;
		//const browseVersionField = browser.capabilities[browser.capabilities.browserName].keys().filter((key) => { return /\w{0,}Version\w{0, 1}/.test(key)})[0];
		addEnvironment('Browser', `${browserName}`);
	});

	it('Apple checkbox', function() {
		browser.url('https://moskva.beeline.ru/shop/');
		addStep('Преходим на вкладку телефоны.');
		const phoneLink = "//span[text()='телефоны']";
		$(phoneLink).click();

		addStep('Кликаем "Показать все" во вкладке производители.');
		const makerShowAll =
			"//span[text()='Производитель']/../..//span[text()='Показать все']";
		$(makerShowAll).waitForExist(5000);
		$(makerShowAll).click();

		addStep('Выбираем телефоны Apple.');
		const appleCheckBox =
			"//input[@id='checkbox__proizvoditel_proizvoditel-apple']";
		$(appleCheckBox).waitForExist(5000);
		$(appleCheckBox).click();

		addStep('Проверяем заголовок.');
		const header = '//h1';
		browser.waitUntil(() => {
			return $(header)
				.getText()
				.includes('Apple');
		}, 5000);
		expect($(header).getText()).to.contain('Apple');
	});

	it('Check buy button', function() {
		addStep('Переходим на страницу магазина.');
		browser.url('https://moskva.beeline.ru/shop/');

		addStep('Переходи на вкладку телефоны.');
		const phoneLink = "//span[text()='телефоны']";
		$(phoneLink).click();

		addStep('Кликаем по фильтру цены.');
		const priceSortButton = "//span[text()=' Цене']/..";
		$(priceSortButton).waitForExist(5000);

		const prevFirstCardText = $(
			"//div[contains(@class, 'ProductCard_component')]"
		)
			.$("//div[contains(@class, 'ProductCard_header')]/a")
			.getText();
		$(priceSortButton).click();
		browser.waitUntil(() => {
			return !prevFirstCardText.includes(
				$("//div[contains(@class, 'ProductCard_component')]")
					.$("//div[contains(@class, 'ProductCard_header')]/a")
					.getText()
			);
		}, 5000);
		const productCards = $$(
			"//div[contains(@class, 'ProductCard_component')]"
		);

		addStep('Ищем товар из середины списка.');
		const buyButton = $$(
			"//div[contains(@class, 'ProductCard_component')]//button"
		)[Math.floor(productCards.length / 2)];

		addStep('Добавляем товар в корзину.');
		buyButton.click();

		browser.waitUntil(() => {
			return browser
				.getUrl()
				.includes('https://moskva.beeline.ru/shop/basket/');
		}, 5000);

		addStep('Проверяем количество товаров в корзине.');

		const headers =
			"//tbody/tr[@data-ng-class='itemRowClass(item)']//div[@class='shop__tarif ng-binding']";
		$(headers).waitForExist(5000);
		let productsCount = $$(headers).length;
		expect(productsCount).to.greaterThan(0);
	});
});
