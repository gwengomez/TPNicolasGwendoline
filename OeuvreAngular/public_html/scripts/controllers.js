'use strict';
/**
 * Déclaration du module controllers qui rassemblera
 * tous les contrôleurs
 */
var controllers = angular.module('controllers', []);

controllers.controller('MainCtrl', ['Connection', '$location', function (Connection, $location) {
        var mainCtrl = this;
        // On référence les méthodes exposées
        mainCtrl.disConnect = disConnect;
        // Par defaut on n'est pas autentifié
        this.isConnected = false;

        /**
         * Déconnexion : isConnected passe à faux => le menu disparaîtra
         * On recharge la page principale
         */
        function disConnect() {
            Connection.setConnected(false);
            $location.path('/home');
        }
        
        this.isConnected = function isConnected() {
            return Connection.isConnected();
        }
    }]);

controllers.controller('ConnectionCtrl', ['Connection', '$location', function (Connection, $location) {
        var connectionCtrl = this;
        // On référence les méthodes exposées
        connectionCtrl.signIn = signIn;
        connectionCtrl.login = "";
        connectionCtrl.mdp = "";
        /**
         * Appelle le service Connection avec le login
         * et le pwd. Si Ok redirige vers la page d'accueil
         * sinon affiche un message d'erreur dans la langue en cours
         * @param 
         * @param pwd
         */
        function signIn(login, pwd) {
            connectionCtrl.error = "";
            Connection.getConnection(login, pwd).success(function (proprietaire) {
                if (Connection.isConnected()) {
                    $location.path('/home');
                }
            }).error(function (error) {
                connectionCtrl.error = "Erreur de login ou de mot de passe";
            });
        }
    }]);

controllers.controller('OeuvreCtrl', ['Connection', '$location', 'Oeuvre', function (Connection, $location, Oeuvre) {
        var oeuvreCtrl = this;
        
        Oeuvre.lister().success(function (oeuvres) {
            oeuvreCtrl.oeuvres = oeuvres;
        });
        $location.path('/catalogue.html');
    }]);