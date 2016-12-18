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
        
        function updateOeuvre(oeuvre) {
            var url = Config.urlServer + Config.urlModifierOeuvre;
            return $http.post(url, oeuvre);
        }
        
        function addOeuvre(oeuvre) {
            var url = Config.urlServer + Config.urlAjouterOeuvre;
            return $http.post(url, oeuvre);
        }
        
        function deleteOeuvre(id) {
            var url = Config.urlServer + Config.urlSupprimerOeuvre + id;
            return $http.get(url);
        }
        
        var oeuvre = {
            getOeuvre: getOeuvre,
            updateOeuvre: updateOeuvre,
            addOeuvre: addOeuvre,
            deleteOeuvre: deleteOeuvre
        };
        
        return oeuvre;
}]);

services.factory('Proprietaires', ['$http', 'Config', function ($http, Config) {
        var self = this;
        
        function getProprietaires() {
            var url = Config.urlServer + Config.urlGetProprietaires;
            return $http.get(url);
        }
        
        var proprietaires = {
            getProprietaires: getProprietaires
        };
        
        return proprietaires;
}]);

services.factory('Reservations', ['$http', 'Config', function ($http, Config) {
        var self = this;
        
        function getReservations() {
            var url = Config.urlServer + Config.urlGetReservations;
            return $http.get(url);
        }
        
        var reservations = {
            getReservations: getReservations
        };
        return reservations;
}]);

services.factory('Reservation', ['$http', 'Config', function ($http, Config) {
        var self = this;
        
        function getReservation(id) {
            var url = Config.urlServer + Config.urlGetReservation + id;
            return $http.get(url);
        }
        
        function addReservation(reservation) {
            var url = Config.urlServer + Config.urlAjouterReservation;
            return $http.post(url, reservation);
        }
        
        function confirmerReservation(id_oeuvre, date) {
            var url = Config.urlServer + Config.urlConfirmerReservation + id_oeuvre + "-" + date;
            return $http.get(url);
        }
        
        function deleteReservation(id_oeuvre, date) {
            var url = Config.urlServer + Config.urlSupprimerReservation + id_oeuvre + "-" + date;
            return $http.get(url);
        }
        
        var reservations = {
            getReservation: getReservation,
            addReservation: addReservation,
            confirmerReservation: confirmerReservation,
            deleteReservation: deleteReservation
        };
        return reservations;
}]);

services.factory('Adherents', ['$http', 'Config', function ($http, Config) {
        var self = this;
        
        function getAdherents() {
            var url = Config.urlServer + Config.urlGetAdherents;
            return $http.get(url);
        }
        
        var adherents = {
            getAdherents: getAdherents
        };
        return adherents;
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
            urlGetConnecter: '/getConnexion/',
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