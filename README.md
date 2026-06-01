# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


### Данные
#### IProduct - интерфейс, описывающий сущность товара  
`interface IProduct {`  
`  id: string,` - id товара  
`  title: string,` - название товара  
`  image: string,` - картинка товара  
`  price: number | null,` - цена товара (null = бесценно)  
`  description: string` - развернутое описание товара  
`}`  

#### IBuyer - интерфейс, описывающий сущность покупателя  
`interface IBuyer {`  
  `payment: TPaymentType | '',` - способ оплаты (type TPaymentType = 'online' | 'offline')  
  `address: string,` - адрес доставки  
  `email: string,` - email покупателя  
  `phone: string` - номер телефона покупателя  
`}`  

`type TValidationErrors = Partial<Record<keyof IBuyer, string>>` - тип, содержащий ошибки валидации пользовательских данных  

#### TProductsResponse - тип данных, получаемых с сервера при запросе объекта с массивом товаров  
`type TProductsResponse = {`  
  `total : number,`  
  `items : IProduct[]`  
`}`  

#### IOrderData - интерфейс данных, передаваемых на сервер (информация о покупателе + параметры заказа)

`interface IOrderData extends IBuyer {`   
  `total : number,`  
  `items : string[]`  
`}`  

#### type IOrderResponse - тип ответа сервера на POST-запрос  

`type TOrderResponse = {`  
    `id : string,`  
    `total : number`  
`}`  

## Модели данных

### Класс `Catalog`

Модель каталога товаров.

#### Поля класса

`products: IProduct[] = []` — массив всех товаров;
`chosenProduct: IProduct | null = null` — выбранный товар;
`events: IEvents` — брокер событий.

#### Конструктор

`constructor(events: IEvents)` — принимает брокер событий.

#### Методы

`setProducts(products: IProduct[]): void` — сохраняет массив товаров и генерирует событие `catalog:changed`;
`getProducts(): IProduct[]` — возвращает массив товаров;
`getProductById(id: string): IProduct | undefined` — возвращает товар по `id`;
`setChosenProduct(product: IProduct): void` — сохраняет выбранный товар и генерирует событие `catalog:select`;
`getChosenProduct(): IProduct | null` — возвращает выбранный товар.

---

### Класс `ShoppingCart`

Модель корзины.

#### Поля класса

`productsToBuy: IProduct[] = []` — массив товаров в корзине;
`events: IEvents` — брокер событий.

#### Конструктор

`constructor(events: IEvents)` — принимает брокер событий.

#### Методы

`getProductsToBuy(): IProduct[]` — возвращает товары из корзины;
`addProductToCart(product: IProduct): void` — добавляет товар в корзину, если его там ещё нет;
`deleteProductFromCart(id: string): void` — удаляет товар из корзины по `id`;
`clearCart(): void` — очищает корзину;
`getTotalPrice(): number` — возвращает общую стоимость товаров;
`getProductsAmount(): number` — возвращает количество товаров;
`isInStock(id: string): boolean` — проверяет, есть ли товар в корзине;
`changed(): void` — генерирует событие `basket:changed`.

---

### Класс `Buyer`

Модель данных покупателя.

#### Поля класса

`buyersData: IBuyer` — данные покупателя: способ оплаты, адрес, email и телефон;
`events: IEvents` — брокер событий.

#### Конструктор

`constructor(events: IEvents)` — принимает брокер событий.

#### Методы

`saveBuyersData(data: Partial<IBuyer>): void` — сохраняет часть данных покупателя и генерирует событие `buyer:changed`;
`getBuyersData(): IBuyer` — возвращает данные покупателя;
`clearBuyersData(): void` — очищает данные покупателя;
`validateBuyersData(): TValidationErrors` — проверяет заполненность данных и возвращает объект ошибок.

---

## Компоненты представления

### Класс `Card<T extends ICard = ICard>`

Родительский класс для карточек товара.

#### Поля класса

`titleElement: HTMLElement` — элемент названия товара;
`priceElement: HTMLSpanElement` — элемент цены товара.

#### Конструктор

`constructor(container: HTMLElement)` — принимает DOM-элемент карточки.

#### Сеттеры

`set title(value: string)` — устанавливает название товара;
`set price(value: number | null)` — устанавливает цену товара.

---

### Класс `CardCatalog`

Карточка товара в каталоге.

#### Поля класса

`cardCategory: HTMLSpanElement` — элемент категории товара;
`cardImage: HTMLImageElement` — изображение товара;
`actions: ICardActions` — объект с обработчиком клика.

#### Конструктор

`constructor(actions: ICardActions, container: HTMLElement)` — принимает обработчики действий и DOM-элемент карточки.

#### Сеттеры

`set category(value: string)` — устанавливает категорию и CSS-модификатор из `categoryMap`;
`set image(value: string)` — устанавливает изображение товара.

---

### Класс `CardPreview`

Карточка подробного просмотра товара.

#### Поля класса

`cardCategory: HTMLSpanElement` — категория товара;
`cardImage: HTMLImageElement` — изображение товара;
`cardDescription: HTMLElement` — описание товара;
`cardButton: HTMLButtonElement` — кнопка действия с товаром.

#### Конструктор

`constructor(actions: ICardActions, container: HTMLElement)` — принимает обработчики действий и DOM-элемент карточки.

#### Сеттеры

`set category(value: string)` — устанавливает категорию;
`set image(value: string)` — устанавливает изображение;
`set description(value: string)` — устанавливает описание;
`set buttonText(value: string)` — устанавливает текст кнопки;
`set buttonDisabled(value: boolean)` — включает или отключает кнопку.

---

### Класс `CardBasket`

Карточка товара в корзине.

#### Поля класса

`cardIndex: HTMLElement` — порядковый номер товара;
`cardDeleteButton: HTMLButtonElement` — кнопка удаления товара.

#### Конструктор

`constructor(actions: ICardActions, container: HTMLElement)` — принимает обработчик действия и DOM-элемент карточки.

#### Сеттеры

`set index(value: number)` — устанавливает номер товара в корзине.

---

### Класс `Modal`

Компонент модального окна.

#### Поля класса

`closeButton: HTMLButtonElement` — кнопка закрытия;
`contentElement: HTMLElement` — контейнер содержимого;
`modalContainer: HTMLElement` — внутренний контейнер модального окна;
`events: IEvents` — брокер событий.

#### Конструктор

`constructor(events: IEvents, container: HTMLElement)` — принимает брокер событий и DOM-элемент модального окна.

#### Сеттеры

`set content(value: HTMLElement)` — устанавливает содержимое модального окна.

#### Методы

`open(): void` — открывает модальное окно;
`close(): void` — закрывает модальное окно;
`render(data: IModal): HTMLElement` — устанавливает содержимое и открывает модальное окно.

---

### Класс `Basket`

Компонент корзины.

#### Поля класса

`listElement: HTMLElement` — список товаров;
`totalElement: HTMLElement` — итоговая стоимость;
`orderButton: HTMLButtonElement` — кнопка оформления заказа;
`events: IEvents` — брокер событий.

#### Конструктор

`constructor(events: IEvents, container: HTMLElement)` — принимает брокер событий и DOM-элемент корзины.

#### Сеттеры

`set items(items: HTMLElement[])` — отображает товары или текст `Корзина пуста`;
`set total(value: number)` — устанавливает итоговую стоимость;
`set buttonDisabled(value: boolean)` — включает или отключает кнопку оформления.

---

## Компоненты форм

### Класс `Form<T extends object>`

Родительский класс для форм заказа.

#### Поля класса

`submitButton: HTMLButtonElement` — кнопка отправки формы;
`errorsElement: HTMLElement` — элемент ошибок;
`events: IEvents` — брокер событий;
`container: HTMLFormElement` — DOM-элемент формы.

#### Конструктор

`constructor(events: IEvents, container: HTMLFormElement)` — принимает брокер событий и DOM-элемент формы.

#### Сеттеры

`set valid(value: boolean)` — управляет доступностью кнопки `submit`;
`set errors(value: string)` — выводит текст ошибки.

#### События

При вводе данных генерирует событие вида:

`formName.fieldName:change`

При отправке формы генерирует событие вида:

`formName:submit`

---

### Класс `OrderForm`

Форма первого шага заказа.

#### Поля класса

`paymentButtons: HTMLButtonElement[]` — кнопки выбора оплаты;
`addressInput: HTMLInputElement` — поле адреса.

#### Конструктор

`constructor(events: IEvents, container: HTMLFormElement)` — принимает брокер событий и DOM-элемент формы.

#### Сеттеры

`set payment(value: TPaymentType | '')` — выделяет выбранный способ оплаты классом `button_alt-active`;
`set address(value: string)` — устанавливает адрес доставки.

---

### Класс `ContactsForm`

Форма второго шага заказа.

#### Поля класса

`emailInput: HTMLInputElement` — поле email;
`phoneInput: HTMLInputElement` — поле телефона.

#### Конструктор

`constructor(events: IEvents, container: HTMLFormElement)` — принимает брокер событий и DOM-элемент формы.

#### Сеттеры

`set email(value: string)` — устанавливает email;
`set phone(value: string)` — устанавливает телефон.

---

### Класс `Success`

Компонент успешного оформления заказа.

#### Поля класса

`descriptionElement: HTMLElement` — элемент с суммой заказа;
`closeButton: HTMLButtonElement` — кнопка закрытия;
`events: IEvents` — брокер событий.

#### Конструктор

`constructor(events: IEvents, container: HTMLElement)` — принимает брокер событий и DOM-элемент компонента.

#### Сеттеры

`set total(value: number)` — выводит сумму списания.

---

## Слой презентера

### Файл `main.ts`

Файл `main.ts` связывает модели, компоненты представления и API.

В нём создаются:

`events: EventEmitter` — брокер событий;
`catalog: Catalog` — модель каталога;
`shoppingCart: ShoppingCart` — модель корзины;
`buyer: Buyer` — модель покупателя;
`header: Header` — шапка сайта;
`gallery: Gallery` — каталог товаров;
`modal: Modal` — модальное окно;
`apiCom: ApiCommunication` — слой общения с сервером.

Основные задачи `main.ts`:

* загрузка товаров с сервера;
* отрисовка каталога;
* открытие подробного просмотра товара;
* добавление и удаление товаров из корзины;
* отображение корзины;
* открытие форм заказа;
* валидация данных покупателя;
* отправка заказа на сервер;
* показ сообщения об успешной оплате.

---

## Основные события

`catalog:changed` — каталог товаров изменился;
`catalog:select` — выбран товар для просмотра;
`card:select` — клик по карточке товара;
`card:toggle` — добавление или удаление товара из корзины;
`basket:changed` — корзина изменилась;
`basket:open` — открытие корзины;
`basket:delete` — удаление товара из корзины;
`buyer:changed` — данные покупателя изменились;
`order:open` — открытие первой формы заказа;
`order.payment:change` — изменение способа оплаты;
`order.address:change` — изменение адреса;
`order:submit` — отправка первой формы;
`contacts.email:change` — изменение email;
`contacts.phone:change` — изменение телефона;
`contacts:submit` — отправка второй формы;
`success:close` — закрытие окна успешного заказа.
