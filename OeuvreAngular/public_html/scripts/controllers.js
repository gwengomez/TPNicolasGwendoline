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
        connectionCtrl.pwd = "";
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

controllers.controller('OeuvresCtrl', ['Oeuvres', 'Oeuvre', '$location', '$route', function (Oeuvres, Oeuvre, $location, $route) {
        var oeuvresCtrl = this;
        var oeuvresPromise = Oeuvres.lister();
        oeuvresCtrl.deleteOeuvre = deleteOeuvre;
        
        oeuvresPromise.success(function (data) {
            if (data.length > 0) {
                oeuvresCtrl.oeuvres = data;
            }
        }).error(function (data) {
            oeuvresCtrl.error = data;
            alert(oeuvresCtrl.error);
        });
        
        /**
        * Suppression d'un employé
        * @param {type} id de l'employé à supprimer
        */
        function deleteOeuvre(id) {
            if (id) {
                Oeuvre.deleteOeuvre(id).success(function (data, status) {
                    if (status == 200) {
                        $location.path('/lister');
                        $route.reload();
                    }
                }).error(function (data) {
                    oeuvresCtrl.error = data;
                    alert(oeuvresCtrl.error);
                });
            }
        }
        
        
    }]);

controllers.controller('OeuvreCtrl', ['Oeuvre', 'Proprietaires', '$routeParams', '$location', function (Oeuvre, Proprietaires, $routeParams, $location) {
        var oeuvreCtrl = this;
        oeuvreCtrl.oeuvreId = $routeParams.id;
        if (oeuvreCtrl.oeuvreId)
            oeuvreCtrl.pageTitle = 'Modification';
        else
            oeuvreCtrl.pageTitle = 'Ajout';
        oeuvreCtrl.pageTitle += " d'une oeuvre";
        
        oeuvreCtrl.cancel = cancel;
        oeuvreCtrl.validateOeuvre = validateOeuvre;
        
        // Récupère la liste des employés
        Proprietaires.getProprietaires().success(function (data) {
            oeuvreCtrl.proprietaires = data;
        });
        
        if (oeuvreCtrl.oeuvreId > 0) {
            var oeuvrePromise = Oeuvre.getOeuvre($routeParams.id);
            oeuvrePromise.success(function (data, status) {
                if (status == 200) {
                    oeuvreCtrl.oeuvre = data;
                    oeuvreCtrl.selectedOptionProprietaire = oeuvreCtrl.oeuvre.proprietaire;
                }
            }).error(function (data) {
                oeuvreCtrl.error = data;
                alert(oeuvreCtrl.error);
            });
        }
        
        // On a cliqué sur le bouton Annuler
        function cancel() {
            $location.path('/lister');
        }
        
        /**
         * On a cliqué sur le bouton valider
         * @param {type} id : id de l'oeuvre modifiée
         * @param {type} form : le formulaire complet
         */
        function validateOeuvre(id, form) {
            // Si tout a été saisi, pas de zone oubliée
            if (form.$valid) {
                // On récupère l'objet oeuvre dans le scope de la vue
                var oeuvre = oeuvreCtrl.oeuvre;
                
                // Récupération du proprietaire sélectionné
                oeuvre.proprietaire = oeuvreCtrl.selectedOptionProprietaire;
                oeuvre.id_proprietaire = parseInt(oeuvre.proprietaire.id_proprietaire);
                oeuvre.id_oeuvre = parseInt(0);
                
                // Convertion du prix en double
                oeuvre.prix = parseFloat(oeuvre.prix);
                
                // si on a un id => c'est une modification
                if (id) {
                    // Demande de mise à jour de l'oeuvre
                    Oeuvre.updateOeuvre(oeuvre).success(function (data, status) {
                        // Si c'est OK on consulte la nouvelle liste des oeuvres
                        // Sinon on affiche l'erreur
                        if (status === 200) {
                            $location.path('/lister');
                        }
                    }).error(function (data) {
                        oeuvreCtrl.error = data.message;
                        alert(oeuvreCtrl.error);
                    });
                // Sinon c'est la création d'une nouvelle oeuvre
                } else {
                    // Demande d'ajout de l'oeuvre
                    Oeuvre.addOeuvre(oeuvre).success(function (data, status) {
                        // Si c'est OK on consulte la nouvelle liste des oeuvres
                        // Sinon on affiche l'erreur
                        if (status === 200) {
                            $location.path('/lister');
                        }
                    }).error(function (data) {
                        oeuvreCtrl.error = data.message;
                        alert(oeuvreCtrl.error);
                    });
                }
            } else { // On affiche un message d'erreur type
                oeuvreCtrl.error = "Erreur dans l'enregistrement de l'oeuvre";
            }
            
        }
    }]);