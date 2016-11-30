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
            $location.path('/connect');
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

controllers.controller('OeuvresCtrl', ['Oeuvres', function (Oeuvres) {
        var oeuvresCtrl = this;
        var oeuvresPromise = Oeuvres.lister();
        oeuvresPromise.success(function (data) {
            if (data.length > 0) {
                oeuvresCtrl.oeuvres = data;
            }
        }).error(function (data) {
            oeuvresCtrl.error = data;
            alert(oeuvresCtrl.error);
        });
        
        
    }]);

controllers.controller('OeuvreCtrl', ['Oeuvre', '$routeParams', function (Oeuvre, $routeParams) {
        var oeuvreCtrl = this;
        oeuvreCtrl.oeuvreId = $routeParams.id;
        if (oeuvreCtrl.oeuvreId)
            oeuvreCtrl.pageTitle = 'Modification';
        else
            oeuvreCtrl.pageTitle = 'Ajout';
        oeuvreCtrl.pageTitle += " d'une oeuvre";
        
        if (oeuvreCtrl.oeuvreId > 0) {
            var oeuvrePromise = Oeuvre.getOeuvre($routeParams.id);
            oeuvrePromise.success(function (data, status) {
                if (status == 200) {
                    oeuvreCtrl.oeuvre = data;
                }
            }).error(function (data) {
                oeuvreCtrl.error = data;
                alert(oeuvreCtrl.error);
            });
        }
        
        // On a cliqué sur le bouton Annuler
        function cancel() {
            $location.path('/getEmployees');
        }
    }]);