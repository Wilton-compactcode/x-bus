

//INICIALIZAÇÃO DO F7 QUANDO DISPOSITIVO ESTÁ PRONTO
document.addEventListener('deviceready', onDeviceReady, false);
var app = new Framework7({
  // App root element
  el: '#app',
  // App Name
  name: 'Event Ônibus',
  // App id
  id: 'br.com.event.bus',
  // Enable swipe panel
  panel: {
    swipe: true,
  },
  dialog: {
    buttonOk: 'Sim',
    buttonCancel: 'Cancelar',
  },
  // Add default routes
  routes: [
    {
      path: '/index/',
      url: 'index.html',
      animate: false,
	  on: {
		pageInit: function (event, page) {
			$.getScript('js/index.js');
		},
	  }
    },
    {
      path: '/tabelasHTML/',
      url: 'tabelasHTML.html',
      animate: false,
      on: {
        pageInit: function (event, page) {
          $.getScript('js/index.js');
        },
      },
    },
    {
      path: '/indicadores/',
      url: 'indicadores.html',
      animate: false,
	  on: {
		pageInit: function (event, page) {
      $.getScript('js/index.js');
		},
	  }
    },
    {
      path: '/limpeza/',
      url: 'limpeza.html',
      animate: false,
	  on: {
		
		pageInit: function (event, page) {
      $.getScript('js/index.js');
		},
		
	  }
    },
    {
      path: '/listLimpeza/',
      url: 'listLimpeza.html',
      animate: false,
	  on: {
		
		pageInit: function (event, page) {
      $.getScript('js/index.js');
		},
		
	  }
    },
    {
      path: '/congresso/',
      url: 'congresso.html',
      animate: false,
	  on: {
		pageInit: function (event, page) {
		// fazer algo quando a página for inicializada
			$.getScript('js/index.js');
		},
		
	  }
    },
    {
      path: '/listCongPessoas/',
      url: 'listCongPessoas.html',
      animate: false,
	  on: {
		pageInit: function (event, page) {
		// fazer algo quando a página for inicializada
			$.getScript('js/index.js');
      ListarPessoas();
		},
		
	  }
    },
    // {
    //   path: '/editarRegistroCongresso/',
    //   url: 'editarRegistroCongresso.html',
    //   animate: false,
	  // on: {
		// pageInit: function (event, page) {
		// // fazer algo quando a página for inicializada
		// 	$.getScript('js/index.js');
		// 	$.getScript('/listCongPessoas/');
    //   ListarPessoas();
		// },
		
	  // }
    // },
    {
      path: '/assembleia/',
      url: 'assembleia.html',
      animate: false,
	  on: {
		pageInit: function (event, page) {
      $.getScript('js/index.js');
		},
	  }
    },
    {
      path: '/listAssebPessoas/',
      url: 'listAssebPessoas.html',
      animate: false,
	  on: {
		pageInit: function (event, page) {
      $.getScript('js/index.js');
      
		},
	  }
    },
    {
      path: '/listIndicadores/',
      url: 'listIndicadores.html',
      animate: false,
	  on: {
		pageInit: function (event, page) {
      $.getScript('js/index.js');
      
		},
	  }
    },
  ],
  // ... other parameters
});

//Para testes direto no navegador
var mainView = app.views.create('.view-main', { url: '/index/' });

//EVENTO PARA SABER O ITEM DO MENU ATUAL
app.on('routeChange', function (route) {
  var currentRoute = route.url;
  console.log(currentRoute);
  document.querySelectorAll('.tab-link').forEach(function (el) {
    el.classList.remove('active');
  });
  var targetEl = document.querySelector('.tab-link[href="' + currentRoute + '"]');
  if (targetEl) {
    targetEl.classList.add('active');
  }
});


function onDeviceReady() {
  //Quando estiver rodando no celular
  // var mainView = app.views.create('.view-main', { url: '/index/' });

  //COMANDO PARA "OUVIR" O BOTAO VOLTAR NATIVO DO ANDROID 	
  document.addEventListener("backbutton", function (e) {

    if (mainView.router.currentRoute.path === '/index/') {
      e.preventDefault();
      app.dialog.confirm('Deseja sair do aplicativo?', function () {
        navigator.app.exitApp();
      });
    } else {
      e.preventDefault();
      mainView.router.back({ force: true });
    }
  }, false);

}