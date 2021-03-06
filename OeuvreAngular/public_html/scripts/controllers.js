'use strict';
/**
 * Déclaration du module controllers qui rassemblera
 * tous les contrôleurs
 */
var controllers = angular.module('controllers', []);

controllers.controller('MainCtrl', ['Connection', '$location', '$cookieStore', function (Connection, $location, $cookieStore) {
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
            //Connection.setConnected(false);
            $cookieStore.put('user', null);
            $location.path('/connect');
        }
        
        this.isConnected = function isConnected() {
            if ($cookieStore.get('user') !== null)
                return true;
            else
                return false;
            //return Connection.isConnected();
        };
    }]);

controllers.controller('ConnectionCtrl', ['Connection', '$location', '$cookieStore', function (Connection, $location, $cookieStore) {
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
                if (proprietaire && proprietaire.pwd === pwd) {
                    $cookieStore.put('user', proprietaire);
                    $location.path('/home');
                }
            }).error(function (error) {
                connectionCtrl.error = "Erreur de login ou de mot de passe";
            });
        }
    }]);

controllers.controller('UserCtrl', ['Connection', 'User', '$location', '$cookieStore', function (Connection, User, $location, $cookieStore) {
        var userCtrl = this;
        // On référence les méthodes exposées
        userCtrl.editUser = editUser;
        
        userCtrl.user = $cookieStore.get('user');
        
        if (userCtrl.user)
            userCtrl.pageTitle = 'Modification du ';
        else
            userCtrl.pageTitle = "Ajout d'un ";
        userCtrl.pageTitle += "compte";

        /**
         * Met à jour un utilisateur
         * Le crée s'il n'existe pas
         */
        function editUser() {
            if (!userCtrl.user.id_proprietaire)
                userCtrl.user.id_proprietaire = parseInt(0);
            if (userCtrl.user.id_proprietaire > 0) {
                User.modifierUser(userCtrl.user).success(function (data, status) {
                        // Si c'est OK on consulte la nouvelle liste des oeuvres
                        // Sinon on affiche l'erreur
                        if (status === 200) {
                            $cookieStore.put('user', userCtrl.user);
                            $location.path('/profil');
                            userCtrl.succes = "Votre compte a bien été modifié !";
                        }
                    }).error(function (data) {
                        userCtrl.error = data.message;
                        alert(userCtrl.error);
                    });
            } else {
                User.ajouterUser(userCtrl.user).success(function (data, status) {
                        // Si c'est OK on consulte la nouvelle liste des oeuvres
                        // Sinon on affiche l'erreur
                        if (status === 200) {
                            Connection.getConnection(userCtrl.user.login, userCtrl.user.pwd).success(function (proprietaire) {
                                if (proprietaire && proprietaire.pwd === userCtrl.user.pwd) {
                                    $cookieStore.put('user', proprietaire);
                                    $location.path('/home');
                                }
                            }).error(function (error) {
                                userCtrl.error = "Erreur de login ou de mot de passe";
                            });
                        }
                    }).error(function (data) {
                        userCtrl.error = data.message;
                        alert(userCtrl.error);
                    });
            }
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
        * Suppression d'une oeuvre
        * @param {type} id de l'oeuvre à supprimer
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

controllers.controller('OeuvreCtrl', ['Oeuvre', 'Proprietaires', '$routeParams', '$location', '$route', function (Oeuvre, Proprietaires, $routeParams, $location, $route) {
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
                if (oeuvre.id_oeuvre)
                    oeuvre.id_oeuvre = parseInt(id);
                else
                    oeuvre.id_oeuvre = parseInt(0);
                
                // Convertion du prix en double
                if (isNaN(parseFloat(oeuvre.prix))) {
                    oeuvreCtrl.error = "Veuillez saisir un nombre.";
                } else {
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
                }
            } else { // On affiche un message d'erreur type
                oeuvreCtrl.error = "Erreur dans l'enregistrement de l'oeuvre";
            }
            
        }
    }]);

controllers.controller('ReservationsCtrl', ['Reservations', 'Reservation', '$route', '$location', function (Reservations, Reservation, $route, $location) {
        var reservationsCtrl = this;
        var reservationsPromise = Reservations.getReservations();
        reservationsCtrl.deleteReservation = deleteReservation;
        reservationsCtrl.confirmerReservation = confirmerReservation;
        
        reservationsPromise.success(function (data) {
            if (data.length > 0) {
                reservationsCtrl.reservations = data;
            }
        }).error(function (data) {
            reservationsCtrl.error = data;
            alert(reservationsCtrl.error);
        });
        
        function confirmerReservation(id_oeuvre, date) {
            if (id_oeuvre && date) {
                Reservation.confirmerReservation(id_oeuvre, date).success(function (data, status) {
                    if (status == 200) {
                        $location.path('/reservations');
                        $route.reload();
                    }
                }).error(function (data) {
                    reservationsCtrl.error = data;
                    alert(reservationsCtrl.error);
                });
            }
        }
        
        /**
        * Suppression d'une reservation
        * @param {type} id de la reservation à supprimer
        */
        function deleteReservation(id_oeuvre, date) {
            if (id_oeuvre && date) {
                Reservation.deleteReservation(id_oeuvre, date).success(function (data, status) {
                    if (status == 200) {
                        $location.path('/reservations');
                        $route.reload();
                    }
                }).error(function (data) {
                    reservationsCtrl.error = data;
                    alert(reservationsCtrl.error);
                });
            }
        }
    }]);

controllers.controller('ReservationCtrl', ['Oeuvre', 'Adherents', 'Reservation', '$routeParams', '$location', function (Oeuvre, Adherents, Reservation, $routeParams, $location) {
        var reservationCtrl = this;
        reservationCtrl.datePickerOpened = false;
        reservationCtrl.openDatePicker = function () {
            reservationCtrl.datePickerOpened = true;
        };
        reservationCtrl.oeuvreId = $routeParams.id;
        
        reservationCtrl.cancel = cancel;
        reservationCtrl.ajouterReservation = ajouterReservation;
        
        // Récupère la liste des reservations
        Adherents.getAdherents().success(function (data) {
            reservationCtrl.adherents = data;
            reservationCtrl.selectedOptionAdherent = reservationCtrl.adherents;
        }).error(function (data) {
            reservationCtrl.error = data;
            alert(reservationCtrl.error);
        });
        
        var reservationPromise = Oeuvre.getOeuvre($routeParams.id);
        reservationPromise.success(function (data, status) {
            if (status == 200) {
                reservationCtrl.oeuvre = data
            }
        }).error(function (data) {
            reservationCtrl.error = data;
            alert(reservationCtrl.error);
        });
        
        // On a cliqué sur le bouton Annuler
        function cancel() {
            $location.path('/reservations');
        }
        
        /**
         * On a cliqué sur le bouton valider
         * @param {type} id : id de l'oeuvre a reserver
         * @param {type} form : le formulaire complet
         */
        function ajouterReservation(id, form) {
            // Si tout a été saisi, pas de zone oubliée
            if (form.$valid) {
                // On récupère l'objet oeuvre dans le scope de la vue
                var oeuvre = reservationCtrl.oeuvre;
                var reservation = reservationCtrl.reservation;
                var adherent = reservationCtrl.selectedOptionAdherent;
                reservation.id_adherent = adherent.id_adherent;
                reservation.id_oeuvre = oeuvre.id_oeuvre;
                // On récupère la date au format MySql
                reservation.date_reservation = new Date(reservationCtrl.reservation.date_reservation.toString());
                // Création d'une nouvelle reservation
                Reservation.addReservation(reservation).success(function (data, status) {
                    // Si c'est OK on consulte la nouvelle liste des reservations
                    // Sinon on affiche l'erreur
                    if (status === 200) {
                        $location.path('/reservations');
                    }
                }).error(function (data) {
                    reservationCtrl.error = data;
                    alert(reservationCtrl.error);
                });
            } else { // On affiche un message d'erreur type
                reservationCtrl.error = "Erreur durant la validation du formulaire";
            }
        }
    }]);