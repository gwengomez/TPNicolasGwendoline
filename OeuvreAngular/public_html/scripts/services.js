'use strict';
var services = angular.module('services', []);
/**
* Gestion de l'authentification
*/
services.factory('Connection', function () {
    // Expose la méthode getConnexion
    var connection = {
        getConnection: getConnection
    };
    return connection;
    // Vérifie les valeurs fournies
    // et retourne true ou false
    function getConnection(login, mdp) {
        var OK = false;
        if ((login === "admin") && (mdp === "mdp"))
        OK = true;
        return OK;
    }
});

/**
* Définition des urls
*/
services.factory('Config', [function () {
    return {
        urlServer: 'http://localhost:/OeuvresRestFul/webresources/webservices',
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
        urlSupprimerOeuvre: '/supprimerOeuvre/'
    };
}]);