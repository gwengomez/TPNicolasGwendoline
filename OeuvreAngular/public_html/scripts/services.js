'use strict';
var services = angular.module('services', []);
/**
 * Gestion de l'authentification
 */
services.factory('Connection', ['$http', 'Config', function ($http, Config) {
        // Expose la méthode getConnexion
        var self = this;


        var connected = false;

        function isConnected() {
            return connected;
        }
        
        function setConnected(value) {
            connected = value;
        }
        // Vérifie les valeurs fournies
        // et retourne true ou false
        function getConnection(login, pwd) {
            var url = Config.urlServer + Config.urlGetConnecter + login;
            return $http.get(url).success(function(proprietaire) {
                if (proprietaire && proprietaire.pwd === pwd) {
                    connected = true;
                }
            });
        }
        
        var connection = {
            getConnection: getConnection,
            isConnected: isConnected,
            setConnected : setConnected
        };

        return connection;

    }]);

services.factory('Oeuvres', ['$http', 'Config', function ($http, Config) {
        var self = this;
        
        function lister() {
            var url = Config.urlServer + Config.urlGetOeuvres;
            return $http.get(url);
        }
        
        var oeuvres = {
            lister: lister
        };
        
        return oeuvres;
}]);

services.factory('Oeuvre', ['$http', 'Config', function ($http, Config) {
        var self = this;
        
        function getOeuvre(id) {
            var url = Config.urlServer + Config.urlGetOeuvre + id;
            return $http.get(url);
        }
        
        var oeuvre = {
            getOeuvre: getOeuvre
        };
        
        return oeuvre;
}]);
/**
 * Définition des urls
 */
services.factory('Config', [function () {
        return {
            urlServer: 'http://localhost:8080/OeuvresRestFul/webresources/webservices',
            urlGetOeuvres: '/getOeuvres',
            urlGetOeuvre: '/getOeuvre/',
            urlGetProprietaire: '/getProprietaire/',
            urlGetReservation: '/getReservation/',
            urlGetProprietaires: '/getProprietaires',
            urlGetReservations: '/getReservations',
            urlGetAdherents: '/getAdherents',
            urlGetConnecter: '/getConnecter/',
            urlAjouterOeuvre: '/ajouterOeuvre',
            urlModifierOeuvre: '/modifierOeuvre',
            urlModifierProprietaire: '/modifierProprietaire',
            urlAjouterProprietaire: '/ajouterProprietaire',
            urlAjouterReservation: '/ajouterReservation',
            urlConfirmerReservation: '/confirmerReservation/',
            urlSupprimerReservation: '/supprimerReservation/',
            urlSupprimerOeuvre: '/supprimerOeuvre/'
        };
    }]);