----------------------------------------------------------
Application de gestion des oeuvres développée avec Angular
----------------------------------------------------------

Toutes les fonctionnalités présentes dans l'application
OeuvresJDBC créée l'année précédente fonctionnent.

Ces fonctionnalités regroupent :
- la connexion d'un utilisateur,
- la déconnexion d'un utilisateur
- la création d'une oeuvre
- l'affichage de toutes les oeuvres
- la modification d'une oeuvre
- la suppression d'une oeuvre
- la réservation d'une oeuvre
- l'affichage de toutes les réservations
- la confirmation d'une réservation
- la suppression d'une réservation

De plus, quelques fonctionnalités ont été rajoutées :
- la création d'un compte utilisateur
- la modification des informations d'un utilisateur

Afin de pouvoir utiliser ces fonctionnalités, l'application
de webservices OeuvresRestFul à été modifié.
Cette modification prend en compte le login et le mot de
passe lors de la création et de la modification d'un
utilisateur.
La nouvelle version de l'appliation OeuvreRestFul est 
disponible dans ce dossier. Il suffit de la déployer sur 
un serveur glassfish.

La gestion de la connexion est réalisée à l'aide du module
ngCookies. Celui-ci permet d'enregistrer des informations 
dans des cookies. Dans notre cas, nous enregistrons 
l'utilisateur actuellement connecté dans un cookie afin de
pouvoir garder ses données.
Ce module se trouve à l'emplacement lib/angular/ngCookies.