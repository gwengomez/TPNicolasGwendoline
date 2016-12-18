----------------------------------------------------------
Application de gestion des oeuvres d�velopp�e avec Angular
----------------------------------------------------------

Toutes les fonctionnalit�s pr�sentes dans l'application
OeuvresJDBC cr��e l'ann�e pr�c�dente fonctionnent.

Ces fonctionnalit�s regroupent :
- la connexion d'un utilisateur,
- la d�connexion d'un utilisateur
- la cr�ation d'une oeuvre
- l'affichage de toutes les oeuvres
- la modification d'une oeuvre
- la suppression d'une oeuvre
- la r�servation d'une oeuvre
- l'affichage de toutes les r�servations
- la confirmation d'une r�servation
- la suppression d'une r�servation

De plus, quelques fonctionnalit�s ont �t� rajout�es :
- la cr�ation d'un compte utilisateur
- la modification des informations d'un utilisateur

Afin de pouvoir utiliser ces fonctionnalit�s, l'application
de webservices OeuvresRestFul � �t� modifi�.
Cette modification prend en compte le login et le mot de
passe lors de la cr�ation et de la modification d'un
utilisateur.
La nouvelle version de l'appliation OeuvreRestFul est 
disponible dans ce dossier. Il suffit de la d�ployer sur 
un serveur glassfish.

La gestion de la connexion est r�alis�e � l'aide du module
ngCookies. Celui-ci permet d'enregistrer des informations 
dans des cookies. Dans notre cas, nous enregistrons 
l'utilisateur actuellement connect� dans un cookie afin de
pouvoir garder ses donn�es.
Ce module se trouve � l'emplacement lib/angular/ngCookies.