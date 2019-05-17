# Projeto Mapa de Lugares Udacity

Com esse projeto vamos visualizar no mapa meus lugares de interesse em minha cidade.
Para rodar o projeto basta abrir o arquivo index.html no browser.
Para alterar o projeto de acordo com os seus próprios lugares favoritos, siga os passos abaixo:

### Passos:

#### 1. Foursquare

Crie uma conta no [Foursquare](https://developer.foursquare.com/). 

Depois:

 - Clique em criar novo app;
 - Dê um nome para seu aplicativo;
 - Clique na seleção de uso pessoal;
 - Clique na caixa não sei ainda;
 - Para o endereço da página do app coloque `localhost`;
 - Salve e quando pedir número de cartão de crédito, não precisa colocar. Clique em voltar para o aplicativo;
 - Copie as chaves geradas sendo: CLIENT_ID e CLIENT_SECRET para um bloco de notas.

#### 2. Google

Crie uma conta no [Google Cloud](https://console.developers.google.com/).

Depois:

 - Crie um novo projeto;
 - Em biblioteca, ative Maps Javascript API para esse projeto;
 - Clique em Credenciais;
 - Clique no botão criar credenciais;
 - Escolha a primeira opção Chave de API;
 - Copie chave gerada API_KEY para um bloco de notas.

#### 3. Substituir

Localizar no Foursquare seus lugares favoritos e anotar as keys e latitude e longitude dos lugares.

Exemplo:

No endereço abaixo:

[https://pt.foursquare.com/v/campina-grande/4c4a6ae5f7cc1b8db6195c3e](https://pt.foursquare.com/v/campina-grande/4c4a6ae5f7cc1b8db6195c3e)

Anote a key `4c4a6ae5f7cc1b8db6195c3e`.

Entre nesse link e na página que abre clicar no link:

`Obter orientação`.

Na página que abrir vai constar um endereço contendo latitude e longitude conforme abaixo:

[https://www.google.com/maps/dir//-7.222162,-35.8729792/@-7.2222248,-35.9429957,12z
](https://www.google.com/maps/dir//-7.222162,-35.8729792/@-7.2222248,-35.9429957,12z)

Anote o seguinte:
Latitude : -7.222162
Longitude: -35.872979

Pronto.

Agora basta no arquivo app.js criar uma entrada na lista places conforme abaixo:


```
places = [
    {
        id: 01,
        type: 'cidade',
        title: 'Campina Grande',
        location:{
            lat: -7.222162,
            lng: -35.872979
        },
        foursquare: '4c4a6ae5f7cc1b8db6195c3e'
    },

```

 - Em id, coloque um identificador único nessa lista;
 - Em type, coloque a categoria do seu lugar favorito;
 - Em title, coloque o título do lugar;
 - em location, coloque a latitude e longitude anotadas;
 - em foursquare, coloque a key anotada.


Ainda no arquivo app.js, substituir as chaves de CLIENT_ID e CLIENT_SECRET pelas chaves criadas na Foursquare.

No arquivo index.html, substituir a chave de API_KEY pela chave gerada no Google.

Abrir o arquivo index.html no browser.
Pronto. Agora é para conseguir visualizar o mapa com seus lugares favoritos.


Tiago Mendes
<tetigo@gmail.com>
