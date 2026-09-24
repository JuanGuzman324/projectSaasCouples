# Revisión nativa de alemán y francés

Generado el 2026-09-24 directo del contenido
real de `src/locales/` (`node scripts/gen-review-doc.mjs`, no a mano —
si cambia el texto fuente, se vuelve a generar, no se edita este archivo
directamente).

**415 claves** en **14 namespaces**. El español
y el inglés se muestran solo como referencia de qué dice cada texto — la
traducción de referencia es el español (`src/locales/es/`, idioma base
del proyecto); lo que hace falta revisar de verdad es la columna `de` y
la columna `fr`.

Qué buscar especialmente:
- Que suene natural, no traducido literalmente palabra por palabra.
- El tono cálido/romántico de la app (`moments.json`, `home.json`
  sobre todo) — fácil de volver robótico al traducir.
- Formalidad: `fr` usa **tuteo** (`tu`, no `vous`) en todo el proyecto,
  a propósito, por el tono cercano de la app. `de` usa **"du"**, no
  "Sie".
- Interpolaciones (`{{count}}`, `{{word}}`, etc.) y textos entre
  comillas dobles escapadas (`\"...\"`) deben conservarse igual, solo
  traduciendo alrededor.
- Que `npm run check:locales` siga en verde después de cualquier cambio
  (compara claves, no contenido — solo confirma que no falte ni sobre
  ninguna).

## `auth` (17 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `login.createAccount` | Crear una cuenta | Create an account | Konto erstellen | Créer un compte |
| `login.email` | Correo | Email | E-Mail | E-mail |
| `login.error.invalid` | Correo o contraseña incorrectos. | Incorrect email or password. | E-Mail oder Passwort ist falsch. | E-mail ou mot de passe incorrect. |
| `login.noAccount` | ¿No tienes cuenta? | Don't have an account? | Noch kein Konto? | Pas encore de compte ? |
| `login.password` | Contraseña | Password | Passwort | Mot de passe |
| `login.submit` | Entrar | Log in | Anmelden | Se connecter |
| `login.title` | Inicia sesión | Log in | Anmelden | Connexion |
| `register.acceptLegal.and` | y los | and the | und die | et les |
| `register.acceptLegal.prefix` | He leído y acepto la | I have read and accept the | Ich akzeptiere die | J'ai lu et j'accepte la |
| `register.acceptLegal.privacy` | Política de Privacidad | Privacy Policy | Datenschutzerklärung | Politique de confidentialité |
| `register.acceptLegal.terms` | Términos y Condiciones | Terms and Conditions | Allgemeinen Geschäftsbedingungen | Conditions générales |
| `register.checkEmail` | Revisa tu correo para confirmar la cuenta antes de continuar. | Check your email to confirm your account before continuing. | Bitte bestätige dein Konto über die E-Mail, die wir dir geschickt haben. | Vérifiez votre e-mail pour confirmer votre compte avant de continuer. |
| `register.error.generic` | No se pudo crear la cuenta. Intenta de nuevo. | Couldn't create the account. Please try again. | Konto konnte nicht erstellt werden. Bitte versuche es erneut. | Impossible de créer le compte. Merci de réessayer. |
| `register.goLogin` | Inicia sesión | Log in | Anmelden | Se connecter |
| `register.hasAccount` | ¿Ya tienes cuenta? | Already have an account? | Schon ein Konto? | Vous avez déjà un compte ? |
| `register.submit` | Crear cuenta | Create account | Konto erstellen | Créer le compte |
| `register.title` | Crea tu cuenta | Create your account | Konto erstellen | Créez votre compte |

## `common` (27 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.back` | Volver | Back | Zurück | Retour |
| `action.cancel` | Cancelar | Cancel | Abbrechen | Annuler |
| `action.continue` | Continuar | Continue | Weiter | Continuer |
| `action.copied` | Copiado | Copied | Kopiert | Copié |
| `action.copy` | Copiar | Copy | Kopieren | Copier |
| `action.logout` | Cerrar sesión | Log out | Abmelden | Se déconnecter |
| `action.save` | Guardar | Save | Speichern | Enregistrer |
| `app.name` | Nuestra historia | Our Story | Unsere Geschichte | Notre histoire |
| `footer.privacy` | Privacidad | Privacy | Datenschutz | Confidentialité |
| `footer.storage` | Qué guardamos en tu dispositivo | What we store on your device | Was wir auf deinem Gerät speichern | Ce que nous stockons sur ton appareil |
| `footer.terms` | Términos | Terms | AGB | Conditions |
| `language.select` | Idioma | Language | Sprache | Langue |
| `offline.offline` | Sin conexión. Estás viendo la última versión guardada. | You're offline. Showing the last saved version. | Du bist offline. Das ist der zuletzt gespeicherte Stand. | Vous êtes hors ligne. Voici la dernière version enregistrée. |
| `offline.offlinePending_one` | Sin conexión. {{count}} cambio se sincronizará al volver la señal. | You're offline. {{count}} change will sync once you're back online. | Du bist offline. {{count}} Änderung wird synchronisiert, sobald du wieder online bist. | Vous êtes hors ligne. {{count}} modification sera synchronisée au retour du réseau. |
| `offline.offlinePending_other` | Sin conexión. {{count}} cambios se sincronizarán al volver la señal. | You're offline. {{count}} changes will sync once you're back online. | Du bist offline. {{count}} Änderungen werden synchronisiert, sobald du wieder online bist. | Vous êtes hors ligne. {{count}} modifications seront synchronisées au retour du réseau. |
| `offline.syncing_one` | Sincronizando {{count}} cambio pendiente… | Syncing {{count}} pending change… | Synchronisiere {{count}} ausstehende Änderung… | Synchronisation de {{count}} modification en attente… |
| `offline.syncing_other` | Sincronizando {{count}} cambios pendientes… | Syncing {{count}} pending changes… | Synchronisiere {{count}} ausstehende Änderungen… | Synchronisation de {{count}} modifications en attente… |
| `photo.choose` | Elegir foto | Choose photo | Foto auswählen | Choisir une photo |
| `photo.error.decode` | No se pudo leer esa imagen. | Couldn't read that image. | Dieses Bild konnte nicht gelesen werden. | Impossible de lire cette image. |
| `photo.error.tooLarge` | La foto pesa demasiado (máximo 15 MB). | That photo is too large (15 MB max). | Das Foto ist zu groß (maximal 15 MB). | Cette photo est trop lourde (15 Mo maximum). |
| `photo.error.upload` | No se pudo subir la foto. | Couldn't upload the photo. | Das Foto konnte nicht hochgeladen werden. | Impossible d'envoyer la photo. |
| `photo.none` | Sin foto | No photo | Kein Foto | Aucune photo |
| `photo.remove` | Quitar | Remove | Entfernen | Retirer |
| `photo.uploading` | Subiendo… | Uploading… | Wird hochgeladen… | Envoi en cours… |
| `theme.dark` | Tema: oscuro | Theme: dark | Design: dunkel | Thème : sombre |
| `theme.light` | Tema: claro | Theme: light | Design: hell | Thème : clair |
| `theme.system` | Tema: como el sistema | Theme: match system | Design: wie System | Thème : système |

## `couple` (53 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `invite.code` | Código | Code | Code | Code |
| `invite.explain` | Comparte este código para que se una a tu espacio. | Share this code so they can join your space. | Teile diesen Code, damit die andere Person beitreten kann. | Partagez ce code pour qu'iel puisse rejoindre votre espace. |
| `invite.title` | Invita a tu pareja | Invite your partner | Lade deine Partnerin/deinen Partner ein | Invitez votre partenaire |
| `invite.waiting` | Esperando a que se una la otra persona… | Waiting for the other person to join… | Warten, bis die andere Person beitritt … | En attente que l'autre personne rejoigne… |
| `onboarding.create.startDate` | ¿Cuándo empezó todo? | When did it all begin? | Wann hat alles angefangen? | Quand tout a-t-il commencé ? |
| `onboarding.create.submit` | Crear | Create | Erstellen | Créer |
| `onboarding.create.title` | Crear un espacio nuevo | Create a new space | Neuen Bereich erstellen | Créer un nouvel espace |
| `onboarding.error.alreadyInCouple` | Ya perteneces a un espacio de pareja. | You already belong to a couple space. | Du gehörst bereits zu einem Paar-Bereich. | Vous appartenez déjà à un espace de couple. |
| `onboarding.error.full` | Ese espacio ya tiene dos integrantes. | That space already has two members. | Dieser Bereich hat schon zwei Mitglieder. | Cet espace compte déjà deux membres. |
| `onboarding.error.invalidCode` | Ese código no es válido. | That code isn't valid. | Dieser Code ist ungültig. | Ce code n'est pas valide. |
| `onboarding.join.code` | Código de invitación | Invite code | Einladungscode | Code d'invitation |
| `onboarding.join.submit` | Unirme | Join | Beitreten | Rejoindre |
| `onboarding.join.title` | Unirme con un código | Join with a code | Mit Code beitreten | Rejoindre avec un code |
| `onboarding.subtitle` | Crea un espacio para tu pareja o únete con un código de invitación. | Create a space for your couple, or join with an invite code. | Erstelle einen Bereich für euch beide oder tritt mit einem Einladungscode bei. | Créez un espace pour votre couple, ou rejoignez-en un avec un code d'invitation. |
| `onboarding.title` | Empecemos | Let's get started | Los geht's | Commençons |
| `settings.action.save` | Guardar cambios | Save changes | Änderungen speichern | Enregistrer les modifications |
| `settings.backup.confirmImport` | Esto va a agregar {{count}} elementos a tu espacio (no reemplaza nada). ¿Continuar? | This will add {{count}} items to your space (it won't replace anything). Continue? | Dadurch werden {{count}} Einträge zu eurem Bereich hinzugefügt (nichts wird ersetzt). Fortfahren? | Cela ajoutera {{count}} éléments à votre espace (rien n'est remplacé). Continuer ? |
| `settings.backup.error.export` | No se pudo generar la copia de seguridad. | Couldn't build the backup. | Die Sicherung konnte nicht erstellt werden. | Impossible de générer la sauvegarde. |
| `settings.backup.error.import` | Ese archivo no es una copia de seguridad válida, o algo falló al restaurarla. | That file isn't a valid backup, or something failed while restoring it. | Diese Datei ist keine gültige Sicherung, oder beim Wiederherstellen ist etwas schiefgelaufen. | Ce fichier n'est pas une sauvegarde valide, ou une erreur est survenue lors de la restauration. |
| `settings.backup.export` | Descargar copia | Download backup | Sicherung herunterladen | Télécharger la sauvegarde |
| `settings.backup.hint` | Descarga todos tus recuerdos, fechas y momentos como un archivo JSON, o restaura uno. Las fotos no se incluyen; quedan sin foto y hay que volver a subirlas. | Download all your memories, dates and moments as a JSON file, or restore one. Photos aren't included; restored items come back without a photo and you'll need to re-upload it. | Lade alle deine Erinnerungen, Termine und Momente als JSON-Datei herunter oder stelle eine wieder her. Fotos sind nicht enthalten; wiederhergestellte Einträge haben kein Foto mehr und müssen neu hochgeladen werden. | Téléchargez tous vos souvenirs, dates et moments sous forme de fichier JSON, ou restaurez-en un. Les photos ne sont pas incluses ; les éléments restaurés n'ont plus de photo, il faudra la réimporter. |
| `settings.backup.import` | Restaurar copia | Restore backup | Sicherung wiederherstellen | Restaurer une sauvegarde |
| `settings.backup.result` | Listo: {{memories}} recuerdos, {{dates}} fechas y {{moments}} momentos agregados. | Done: added {{memories}} memories, {{dates}} dates and {{moments}} moments. | Fertig: {{memories}} Erinnerungen, {{dates}} Termine und {{moments}} Momente hinzugefügt. | Terminé : {{memories}} souvenirs, {{dates}} dates et {{moments}} moments ajoutés. |
| `settings.backup.title` | Copia de seguridad | Backup | Sicherungskopie | Sauvegarde |
| `settings.couple.title` | Sobre la pareja | About the couple | Über das Paar | À propos du couple |
| `settings.danger.action` | Eliminar mi cuenta | Delete my account | Mein Konto löschen | Supprimer mon compte |
| `settings.danger.cancel` | Cancelar | Cancel | Abbrechen | Annuler |
| `settings.danger.confirm` | Eliminar cuenta definitivamente | Permanently delete account | Konto endgültig löschen | Supprimer définitivement le compte |
| `settings.danger.confirmExplain` | Esto es permanente: tu cuenta y, si aplica, todo el contenido de tu espacio de pareja se borran sin posibilidad de recuperarlos. | This is permanent: your account and, if applicable, all your couple space's content will be deleted with no way to recover them. | Dies ist endgültig: dein Konto und, falls zutreffend, der gesamte Inhalt eures Paar-Bereichs werden ohne Wiederherstellungsmöglichkeit gelöscht. | C'est définitif : votre compte et, le cas échéant, tout le contenu de votre espace de couple seront supprimés sans possibilité de les récupérer. |
| `settings.danger.confirmLabel` | Escribe {{word}} para confirmar | Type {{word}} to confirm | Gib {{word}} ein, um zu bestätigen | Tapez {{word}} pour confirmer |
| `settings.danger.confirmWord` | ELIMINAR | DELETE | LÖSCHEN | SUPPRIMER |
| `settings.danger.error` | No se pudo eliminar la cuenta. Intenta de nuevo o escríbenos. | Couldn't delete the account. Try again or write to us. | Konto konnte nicht gelöscht werden. Versuch es erneut oder schreib uns. | Impossible de supprimer le compte. Réessayez ou écrivez-nous. |
| `settings.danger.explain` | Borra tu cuenta por completo: tu correo y contraseña dejan de existir en el sistema. Si eres el último miembro de tu espacio de pareja, también se borra todo su contenido (recuerdos, fechas, momentos, cápsulas y fotos). Esta acción no se puede deshacer. | Permanently deletes your account: your email and password stop existing in the system. If you're the last member of your couple space, all of its content (memories, dates, moments, capsules and photos) is deleted too. This action can't be undone. | Löscht dein Konto vollständig: deine E-Mail-Adresse und dein Passwort existieren danach nicht mehr im System. Wenn du das letzte Mitglied eures Paar-Bereichs bist, wird auch dessen gesamter Inhalt gelöscht (Erinnerungen, Termine, Momente, Zeitkapseln und Fotos). Diese Aktion kann nicht rückgängig gemacht werden. | Supprime définitivement votre compte : votre e-mail et votre mot de passe cessent d'exister dans le système. Si vous êtes le dernier membre de votre espace de couple, tout son contenu (souvenirs, dates, moments, capsules et photos) est également supprimé. Cette action est irréversible. |
| `settings.danger.title` | Eliminar mi cuenta | Delete my account | Mein Konto löschen | Supprimer mon compte |
| `settings.error.save` | No se pudo guardar. Intenta de nuevo. | Couldn't save. Try again. | Konnte nicht gespeichert werden. Versuch es noch einmal. | Impossible d'enregistrer. Réessayez. |
| `settings.field.city` | Tu ciudad | Your city | Deine Stadt | Votre ville |
| `settings.field.country` | Tu país | Your country | Dein Land | Votre pays |
| `settings.field.countryHint` | Se usa para sugerirte fechas culturales relevantes en Momentos. | Used to suggest relevant cultural dates in Moments. | Wird verwendet, um passende kulturelle Daten bei Momenten vorzuschlagen. | Utilisé pour suggérer des dates culturelles pertinentes dans Moments. |
| `settings.field.countryNone` | Sin elegir | Not set | Nicht angegeben | Non renseigné |
| `settings.field.displayName` | Tu nombre | Your name | Dein Name | Votre nom |
| `settings.field.lat` | Latitud | Latitude | Breitengrad | Latitude |
| `settings.field.latLonHint` | Opcional, para la tarjeta de distancia entre ciudades en Inicio. | Optional, for the city-distance card on Home. | Optional, für die Entfernungskarte zwischen Städten auf der Startseite. | Facultatif, pour la carte de distance entre villes sur l'accueil. |
| `settings.field.lon` | Longitud | Longitude | Längengrad | Longitude |
| `settings.field.startDate` | ¿Cuándo empezó todo? | When did it all begin? | Wann hat alles angefangen? | Quand tout a-t-il commencé ? |
| `settings.field.tz` | Tu zona horaria | Your time zone | Deine Zeitzone | Votre fuseau horaire |
| `settings.nav` | Ajustes | Settings | Einstellungen | Paramètres |
| `settings.plan.free` | Gratis | Free | Kostenlos | Gratuit |
| `settings.plan.label` | Tu plan | Your plan | Dein Plan | Votre forfait |
| `settings.plan.manage` | Gestionar plan | Manage plan | Plan verwalten | Gérer le forfait |
| `settings.plan.premium` | Premium | Premium | Premium | Premium |
| `settings.profile.title` | Tu perfil | Your profile | Dein Profil | Votre profil |
| `settings.saved` | Guardado. | Saved. | Gespeichert. | Enregistré. |
| `settings.title` | Ajustes | Settings | Einstellungen | Paramètres |

## `culturaldates` (38 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.add` | Agregar como Momento | Add as a Moment | Als Moment hinzufügen | Ajouter comme Moment |
| `action.added` | Ya la agregaste | Already added | Bereits hinzugefügt | Déjà ajoutée |
| `date.amor-amistad-co.message` | Hoy celebramos el amor y la amistad, y tú eres las dos cosas. | Today we celebrate love and friendship, and you're both. | Heute feiern wir Liebe und Freundschaft, und du bist beides. | Aujourd'hui on célèbre l'amour et l'amitié, et tu es les deux. |
| `date.amor-amistad-co.tagline` | El tercer sábado de septiembre, en Colombia | The third Saturday of September, in Colombia | Der dritte Samstag im September, in Kolumbien | Le troisième samedi de septembre, en Colombie |
| `date.amor-amistad-co.title` | Amor y Amistad | Love and Friendship Day | Tag der Liebe und Freundschaft | Jour de l'amour et de l'amitié |
| `date.dia-abrazo.message` | Hoy el mundo celebra los abrazos. Nosotros los celebramos siempre. | Today the world celebrates hugs. We celebrate them always. | Heute feiert die Welt Umarmungen. Wir feiern sie immer. | Aujourd'hui le monde célèbre les câlins. Nous, on les célèbre toujours. |
| `date.dia-abrazo.tagline` | Nada como un abrazo tuyo | Nothing like a hug from you | Nichts geht über eine Umarmung von dir | Rien ne vaut un câlin de toi |
| `date.dia-abrazo.title` | Día Internacional del Abrazo | International Hug Day | Internationaler Tag der Umarmung | Journée internationale du câlin |
| `date.dia-beso.message` | Hoy toca celebrar algo que hacemos todos los días. | Today we celebrate something we do every day. | Heute feiern wir etwas, das wir jeden Tag tun. | Aujourd'hui on célèbre quelque chose qu'on fait tous les jours. |
| `date.dia-beso.tagline` | Una excusa más para besarnos | One more excuse to kiss | Noch ein Grund, sich zu küssen | Une excuse de plus pour s'embrasser |
| `date.dia-beso.title` | Día Internacional del Beso | International Kissing Day | Internationaler Tag des Kusses | Journée internationale du baiser |
| `date.dia-namorados-br.message` | Hoy Brasil celebra el amor a su manera, y nosotros a la nuestra. | Today Brazil celebrates love its own way, and we celebrate ours. | Heute feiert Brasilien die Liebe auf seine Art, und wir auf unsere. | Aujourd'hui le Brésil célèbre l'amour à sa façon, et nous à la nôtre. |
| `date.dia-namorados-br.tagline` | El día de los enamorados en Brasil, el 12 de junio | Brazil's Valentine's Day, on June 12 | Brasiliens Valentinstag, am 12. Juni | La Saint-Valentin brésilienne, le 12 juin |
| `date.dia-namorados-br.title` | Dia dos Namorados | Dia dos Namorados | Dia dos Namorados | Dia dos Namorados |
| `date.flores-amarillas.message` | Hoy el mundo se llena de amarillo, y yo solo quería llenarlo de ti. | Today the world fills with yellow, and I just wanted to fill it with you. | Heute füllt sich die Welt mit Gelb, und ich wollte sie einfach mit dir füllen. | Aujourd'hui le monde se remplit de jaune, et je voulais juste le remplir de toi. |
| `date.flores-amarillas.tagline` | Para ti, todas las flores amarillas | For you, all the yellow flowers | Für dich, alle gelben Blumen | Pour toi, toutes les fleurs jaunes |
| `date.flores-amarillas.title` | Día de las flores amarillas | Yellow Flowers Day | Tag der gelben Blumen | Jour des fleurs jaunes |
| `date.pepero-day.message` | Un día tan dulce como tú. | A day as sweet as you. | Ein Tag so süß wie du. | Une journée aussi douce que toi. |
| `date.pepero-day.tagline` | El 11 de noviembre, en Corea | November 11, in Korea | Am 11. November, in Korea | Le 11 novembre, en Corée |
| `date.pepero-day.title` | Pepero Day | Pepero Day | Pepero Day | Pepero Day |
| `date.qixi.message` | Ni un río de estrellas nos separaría. | Not even a river of stars could keep us apart. | Nicht einmal ein Sternenfluss könnte uns trennen. | Même une rivière d'étoiles ne pourrait pas nous séparer. |
| `date.qixi.tagline` | El séptimo día del séptimo mes lunar | The seventh day of the seventh lunar month | Der siebte Tag des siebten Mondmonats | Le septième jour du septième mois lunaire |
| `date.qixi.title` | Qixi (San Valentín chino) | Qixi (Chinese Valentine's Day) | Qixi (chinesischer Valentinstag) | Qixi (Saint-Valentin chinoise) |
| `date.san-valentin.message` | Hoy el mundo celebra lo que nosotros celebramos todos los días. | Today the world celebrates what we celebrate every day. | Heute feiert die Welt, was wir jeden Tag feiern. | Aujourd'hui le monde célèbre ce que nous célébrons chaque jour. |
| `date.san-valentin.tagline` | El día del amor, en casi todo el mundo | The day of love, in most of the world | Der Tag der Liebe, fast überall auf der Welt | Le jour de l'amour, presque partout dans le monde |
| `date.san-valentin.title` | San Valentín | Valentine's Day | Valentinstag | Saint-Valentin |
| `date.sweetest-day.message` | Un pequeño gesto dulce, solo porque sí. | One small sweet gesture, just because. | Eine kleine süße Geste, einfach so. | Un petit geste doux, juste parce que. |
| `date.sweetest-day.tagline` | El tercer sábado de octubre, en Estados Unidos y Canadá | The third Saturday of October, in the US and Canada | Der dritte Samstag im Oktober, in den USA und Kanada | Le troisième samedi d'octobre, aux États-Unis et au Canada |
| `date.sweetest-day.title` | Sweetest Day | Sweetest Day | Sweetest Day | Sweetest Day |
| `date.tanabata.message` | Como las estrellas separadas por el río del cielo, siempre encontramos el camino de vuelta. | Like the stars separated by the river of heaven, we always find our way back. | Wie die Sterne, getrennt durch den Himmelsfluss, finden wir immer zurück zueinander. | Comme les étoiles séparées par la rivière céleste, on retrouve toujours notre chemin. |
| `date.tanabata.tagline` | El festival de las estrellas, en Japón | The star festival, in Japan | Das Sternenfest, in Japan | Le festival des étoiles, au Japon |
| `date.tanabata.title` | Tanabata | Tanabata | Tanabata | Tanabata |
| `date.white-day.message` | Un regalo blanco para quien me da todo lo demás. | A white gift for the one who gives me everything else. | Ein weißes Geschenk für die Person, die mir alles andere gibt. | Un cadeau blanc pour celle ou celui qui me donne tout le reste. |
| `date.white-day.tagline` | El día de devolver el cariño, en Japón y Corea | The day to return the affection, in Japan and Korea | Der Tag, die Zuneigung zu erwidern, in Japan und Korea | Le jour où on rend l'affection, au Japon et en Corée |
| `date.white-day.title` | White Day | White Day | White Day | White Day |
| `intro` | Sugeridas según el país de cada uno. Agrégalas como Momento para que aparezcan en su calendario. | Suggested based on each of your countries. Add them as a Moment so they show up on your calendar. | Vorgeschlagen nach eurem jeweiligen Land. Füge sie als Moment hinzu, damit sie in eurem Kalender erscheinen. | Suggérées selon le pays de chacun. Ajoutez-les comme Moment pour qu'elles apparaissent dans votre calendrier. |
| `noCountry.hint` | Configura tu país en Ajustes para ver sugerencias más específicas (por ahora se muestran solo las globales). | Set your country in Settings to see more specific suggestions (only global ones are shown for now). | Lege dein Land in den Einstellungen fest, um genauere Vorschläge zu sehen (aktuell werden nur globale angezeigt). | Renseignez votre pays dans les Paramètres pour voir des suggestions plus précises (seules les dates globales sont affichées pour l'instant). |
| `title` | Fechas culturales | Cultural dates | Kulturelle Daten | Dates culturelles |

## `dates` (32 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.delete` | Eliminar | Delete | Löschen | Supprimer |
| `action.new` | Nueva fecha | New date | Neuer Termin | Nouvelle date |
| `action.save` | Guardar fecha | Save date | Termin speichern | Enregistrer la date |
| `calendar.empty` | Nada guardado este día. | Nothing saved for this day. | An diesem Tag nichts gespeichert. | Rien d'enregistré ce jour-là. |
| `calendar.nextMonth` | Mes siguiente | Next month | Nächster Monat | Mois suivant |
| `calendar.prevMonth` | Mes anterior | Previous month | Vorheriger Monat | Mois précédent |
| `confirm.delete` | ¿Eliminar esta fecha? | Delete this date? | Diesen Termin löschen? | Supprimer cette date ? |
| `countdown.in_one` | En {{count}} día | In {{count}} day | In {{count}} Tag | Dans {{count}} jour |
| `countdown.in_other` | En {{count}} días | In {{count}} days | In {{count}} Tagen | Dans {{count}} jours |
| `countdown.past_one` | Hace {{count}} día | {{count}} day ago | Vor {{count}} Tag | Il y a {{count}} jour |
| `countdown.past_other` | Hace {{count}} días | {{count}} days ago | Vor {{count}} Tagen | Il y a {{count}} jours |
| `countdown.today` | Hoy | Today | Heute | Aujourd'hui |
| `countdown.tomorrow` | Mañana | Tomorrow | Morgen | Demain |
| `empty.subtitle` | Guarda cumpleaños, aniversarios y la próxima vez que se ven. | Save birthdays, anniversaries, and the next time you'll meet. | Speichere Geburtstage, Jahrestage und euer nächstes Treffen. | Enregistrez anniversaires et votre prochaine rencontre. |
| `empty.title` | Todavía no hay fechas | No dates yet | Noch keine Termine | Pas encore de dates |
| `error.save` | No se pudo guardar la fecha. | Couldn't save the date. | Termin konnte nicht gespeichert werden. | Impossible d'enregistrer la date. |
| `field.date` | Fecha | Date | Datum | Date |
| `field.kind` | Tipo | Type | Art | Type |
| `field.note` | Nota | Note | Notiz | Note |
| `field.place` | Lugar | Place | Ort | Lieu |
| `field.repeat` | Se repite | Repeats | Wiederholung | Répétition |
| `field.title` | Nombre | Name | Name | Nom |
| `kind.aniversario` | Aniversario | Anniversary | Jahrestag | Anniversaire de couple |
| `kind.cumple` | Cumpleaños | Birthday | Geburtstag | Anniversaire |
| `kind.encuentro` | Encuentro | Meetup | Treffen | Rencontre |
| `kind.especial` | Fecha especial | Special date | Besonderer Tag | Date spéciale |
| `kind.otro` | Otro | Other | Sonstiges | Autre |
| `nav` | Fechas | Dates | Termine | Dates |
| `new.title` | Nueva fecha | New date | Neuer Termin | Nouvelle date |
| `repeat.monthly` | Cada mes | Every month | Jeden Monat | Chaque mois |
| `repeat.none` | No se repite | Doesn't repeat | Wiederholt sich nicht | Ne se répète pas |
| `repeat.yearly` | Cada año | Every year | Jedes Jahr | Chaque année |

## `home` (27 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `distance.drive` | En auto, aprox. | By car, approx. | Mit dem Auto, ca. | En voiture, env. |
| `distance.flight` | En avión, aprox. | By plane, approx. | Mit dem Flugzeug, ca. | En avion, env. |
| `distance.hint` | Estimado en línea recta, no una ruta real. | Straight-line estimate, not a real route. | Luftlinie geschätzt, keine echte Route. | Estimation à vol d'oiseau, pas un itinéraire réel. |
| `distance.title` | Distancia entre ustedes | Distance between you | Entfernung zwischen euch | Distance entre vous |
| `hero.daysTogether_one` | {{count}} día juntos | {{count}} day together | {{count}} Tag zusammen | {{count}} jour ensemble |
| `hero.daysTogether_other` | {{count}} días juntos | {{count}} days together | {{count}} Tage zusammen | {{count}} jours ensemble |
| `hero.empty.action` | Configurar | Set it up | Einrichten | Configurer |
| `hero.empty.title` | Empieza con la fecha en que todo comenzó | Start with the date it all began | Beginnt mit dem Datum, an dem alles anfing | Commencez par la date où tout a débuté |
| `hero.liveClock` | y contando… {{time}} | and counting… {{time}} | und es läuft weiter… {{time}} | et ça continue… {{time}} |
| `milestones.anniversary_one` | {{count}} año juntos | {{count}} year together | {{count}} Jahr zusammen | {{count}} an ensemble |
| `milestones.anniversary_other` | {{count}} años juntos | {{count}} years together | {{count}} Jahre zusammen | {{count}} ans ensemble |
| `milestones.day_one` | Día {{count}} | Day {{count}} | Tag {{count}} | Jour {{count}} |
| `milestones.day_other` | Día {{count}} | Day {{count}} | Tag {{count}} | Jour {{count}} |
| `milestones.in_one` | En {{count}} día | In {{count}} day | In {{count}} Tag | Dans {{count}} jour |
| `milestones.in_other` | En {{count}} días | In {{count}} days | In {{count}} Tagen | Dans {{count}} jours |
| `milestones.title` | Próximos hitos | Upcoming milestones | Nächste Meilensteine | Prochains jalons |
| `milestones.today` | ¡Hoy! | Today! | Heute! | Aujourd'hui ! |
| `randomMemory.onThisDay_one` | Hace {{count}} año, un día como hoy | {{count}} year ago, on this day | Vor {{count}} Jahr, heute auf den Tag genau | Il y a {{count}} an, un jour comme aujourd'hui |
| `randomMemory.onThisDay_other` | Hace {{count}} años, un día como hoy | {{count}} years ago, on this day | Vor {{count}} Jahren, heute auf den Tag genau | Il y a {{count}} ans, un jour comme aujourd'hui |
| `randomMemory.shuffle` | Otro al azar | Shuffle | Neu mischen | Un autre au hasard |
| `randomMemory.title` | Un recuerdo al azar | A random memory | Eine zufällige Erinnerung | Un souvenir au hasard |
| `thread.hint` | El punto se acerca a medida que se acerca la fecha (no es una medición exacta). | The dot gets closer as the date approaches (not an exact measurement). | Der Punkt rückt näher, je näher das Datum kommt (keine exakte Messung). | Le point se rapproche à mesure que la date approche (pas une mesure exacte). |
| `thread.nextEncounter` | Faltan para el próximo encuentro | Until your next time together | Bis zum nächsten Wiedersehen | Avant votre prochaine rencontre |
| `thread.title` | El hilo entre ustedes | The thread between you | Der Faden zwischen euch | Le fil entre vous |
| `timezone.someone` | Tu pareja | Your partner | Dein Partner/deine Partnerin | Votre partenaire |
| `timezone.title` | Hora de cada uno | Each other's time | Uhrzeit von euch beiden | L'heure de chacun |
| `yearReview.link` | Ver el resumen anual → | See your year in review → | Jahresrückblick ansehen → | Voir le résumé de l'année → |

## `legal` (63 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `privacy.changes.body` | Si hacemos cambios importantes, actualizaremos la fecha de arriba y, si el cambio afecta cómo usamos tus datos, te avisaremos dentro de la app. | If we make significant changes, we'll update the date above and, if the change affects how we use your data, we'll notify you inside the app. | Bei wesentlichen Änderungen aktualisieren wir das Datum oben und benachrichtigen dich in der App, falls sich die Nutzung deiner Daten dadurch ändert. | En cas de changement important, nous mettrons à jour la date ci-dessus et, si le changement affecte l'utilisation de tes données, nous t'en informerons dans l'application. |
| `privacy.changes.title` | Cambios a esta política | Changes to this policy | Änderungen dieser Richtlinie | Modifications de cette politique |
| `privacy.contact.body` | Para cualquier duda sobre tus datos o para ejercer tus derechos, escribe a privacidad@nuestrahistoria.app (dirección de contacto provisional, pendiente de configurar sobre el dominio definitivo). | For any question about your data or to exercise your rights, write to privacidad@nuestrahistoria.app (temporary contact address, pending setup on the final domain). | Bei Fragen zu deinen Daten oder zur Ausübung deiner Rechte schreib an privacidad@nuestrahistoria.app (vorläufige Kontaktadresse, die Einrichtung auf der endgültigen Domain steht noch aus). | Pour toute question sur tes données ou pour exercer tes droits, écris à privacidad@nuestrahistoria.app (adresse de contact provisoire, en attente de configuration sur le domaine définitif). |
| `privacy.contact.title` | Contacto | Contact | Kontakt | Contact |
| `privacy.dataCollected.body` | Tu correo y contraseña para la cuenta. El nombre que muestras, tu ciudad, coordenadas y país si los agregas en Ajustes. El contenido que creas con tu pareja: recuerdos, fotos, fechas, momentos y cápsulas del tiempo. Si activas las notificaciones push, el endpoint que tu navegador nos da para poder enviártelas (no tu ubicación real ni contenido de otras notificaciones). | Your email and password for the account. The display name, city, coordinates and country you add in Settings, if you add them. The content you create with your partner: memories, photos, dates, moments and time capsules. If you turn on push notifications, the endpoint your browser gives us so we can send them to you (not your real location or the content of other notifications). | Deine E-Mail-Adresse und dein Passwort für das Konto. Den Anzeigenamen, die Stadt, Koordinaten und das Land, die du in den Einstellungen hinzufügst, sofern du sie angibst. Die Inhalte, die du mit deiner Partnerin oder deinem Partner erstellst: Erinnerungen, Fotos, Termine, Momente und Zeitkapseln. Wenn du Push-Benachrichtigungen aktivierst, den Endpunkt, den dein Browser uns gibt, damit wir sie dir senden können (nicht deinen tatsächlichen Standort oder den Inhalt anderer Benachrichtigungen). | Ton e-mail et ton mot de passe pour le compte. Le nom affiché, la ville, les coordonnées et le pays que tu ajoutes dans les Paramètres, si tu les renseignes. Le contenu que tu crées avec ton ou ta partenaire : souvenirs, photos, dates, moments et capsules temporelles. Si tu actives les notifications push, le point de terminaison que ton navigateur nous fournit pour pouvoir te les envoyer (ni ta position réelle ni le contenu d'autres notifications). |
| `privacy.dataCollected.title` | Qué datos recogemos | What data we collect | Welche Daten wir erheben | Quelles données nous recueillons |
| `privacy.dataLocation.body` | Tu información vive en la infraestructura de Supabase en Virginia, Estados Unidos (región us-east-1). Si resides en la Unión Europea, esto implica una transferencia internacional de datos, amparada en las salvaguardas contractuales que Supabase ofrece como encargado del tratamiento. No trasladamos tus datos a ningún otro país por nuestra cuenta. | Your information lives on Supabase's infrastructure in Virginia, United States (us-east-1 region). If you live in the European Union, this means an international data transfer, covered by the contractual safeguards Supabase offers as a data processor. We don't move your data to any other country on our own. | Deine Informationen liegen auf der Infrastruktur von Supabase in Virginia, USA (Region us-east-1). Wenn du in der Europäischen Union lebst, bedeutet dies eine internationale Datenübermittlung, die durch die vertraglichen Garantien abgedeckt ist, die Supabase als Auftragsverarbeiter bietet. Wir verschieben deine Daten nicht eigenmächtig in ein anderes Land. | Tes informations résident sur l'infrastructure de Supabase en Virginie, aux États-Unis (région us-east-1). Si tu résides dans l'Union européenne, cela implique un transfert international de données, couvert par les garanties contractuelles que Supabase propose en tant que sous-traitant. Nous ne déplaçons pas tes données vers un autre pays de notre propre initiative. |
| `privacy.dataLocation.title` | Dónde se alojan tus datos | Where your data is hosted | Wo deine Daten gespeichert werden | Où tes données sont hébergées |
| `privacy.deletion.body` | Hoy puedes salir de la pareja desde Ajustes, lo que borra el contenido compartido. El borrado completo de la cuenta (correo e identidad) como flujo de autoservicio todavía está en construcción; mientras tanto, puedes pedirlo escribiéndonos y lo haremos manualmente. | Today you can leave the couple from Settings, which deletes the shared content. A full self-service account deletion flow (email and identity) is still being built; in the meantime, you can request it by writing to us and we'll do it manually. | Heute kannst du die Paarverbindung in den Einstellungen verlassen, wodurch die gemeinsamen Inhalte gelöscht werden. Ein vollständiger Selbstbedienungs-Ablauf zum Löschen des Kontos (E-Mail und Identität) wird noch gebaut; in der Zwischenzeit kannst du dies per E-Mail anfragen, und wir erledigen es manuell. | Aujourd'hui, tu peux quitter le couple depuis les Paramètres, ce qui supprime le contenu partagé. Un parcours de suppression complète du compte en libre-service (e-mail et identité) est encore en construction ; en attendant, tu peux le demander en nous écrivant et nous le ferons manuellement. |
| `privacy.deletion.title` | Borrar tu cuenta | Deleting your account | Dein Konto löschen | Supprimer ton compte |
| `privacy.intro` | Esto explica, en términos llanos, qué datos recoge Nuestra historia, para qué los usamos y qué puedes hacer con ellos. No es asesoría legal: es una descripción honesta de cómo funciona la app hoy. | This explains, in plain terms, what data Nuestra historia collects, what we use it for, and what you can do about it. This is not legal advice: it's an honest description of how the app works today. | Hier erklären wir in einfachen Worten, welche Daten Nuestra historia erhebt, wofür wir sie nutzen und was du damit tun kannst. Dies ist keine Rechtsberatung, sondern eine ehrliche Beschreibung davon, wie die App heute funktioniert. | Ce texte explique, en termes simples, quelles données Nuestra historia recueille, à quoi nous les utilisons et ce que tu peux en faire. Ceci n'est pas un conseil juridique : c'est une description honnête du fonctionnement actuel de l'application. |
| `privacy.legalBasis.body` | Tratamos tus datos porque son necesarios para prestarte el servicio que pediste al crear la cuenta (ejecución de un contrato), y porque diste tu consentimiento explícito al registrarte, marcando la casilla de aceptación. | We process your data because it's necessary to provide the service you asked for when you created your account (performance of a contract), and because you gave explicit consent when registering, by checking the acceptance box. | Wir verarbeiten deine Daten, weil dies zur Erbringung des von dir bei der Kontoerstellung angeforderten Dienstes erforderlich ist (Vertragserfüllung) und weil du bei der Registrierung durch Ankreuzen der Zustimmungsbox ausdrücklich eingewilligt hast. | Nous traitons tes données parce que cela est nécessaire pour fournir le service que tu as demandé en créant ton compte (exécution d'un contrat), et parce que tu as donné ton consentement explicite lors de l'inscription en cochant la case d'acceptation. |
| `privacy.legalBasis.title` | Base legal | Legal basis | Rechtsgrundlage | Base légale |
| `privacy.purpose.body` | Para que la app funcione: mostrarte tu contenido, calcular la distancia y el tiempo juntos, sugerir fechas culturales de tu país, enviarte los recordatorios push que actives y guardar tu idioma preferido. No usamos tus datos para publicidad ni los vendemos a terceros. | To make the app work: showing you your content, calculating distance and time together, suggesting cultural dates for your country, sending the push reminders you turn on, and remembering your preferred language. We don't use your data for advertising and we don't sell it to third parties. | Damit die App funktioniert: um dir deine Inhalte anzuzeigen, Entfernung und gemeinsame Zeit zu berechnen, kulturelle Termine für dein Land vorzuschlagen, die von dir aktivierten Push-Erinnerungen zu senden und deine bevorzugte Sprache zu merken. Wir nutzen deine Daten nicht für Werbung und verkaufen sie nicht an Dritte. | Pour faire fonctionner l'application : t'afficher ton contenu, calculer la distance et le temps passé ensemble, suggérer des dates culturelles selon ton pays, envoyer les rappels push que tu actives et mémoriser ta langue préférée. Nous n'utilisons pas tes données à des fins publicitaires et ne les vendons pas à des tiers. |
| `privacy.purpose.title` | Para qué los usamos | What we use it for | Wofür wir sie nutzen | À quoi nous les utilisons |
| `privacy.retention.body` | Mientras tu cuenta esté activa. Si borras un recuerdo, una fecha, un momento o una cápsula, queda marcado como borrado de inmediato (dejas de verlo) y se elimina de forma definitiva, junto con la foto asociada si tenía una, pasado un tiempo razonable. | For as long as your account is active. If you delete a memory, date, moment or time capsule, it's marked as deleted right away (you stop seeing it) and permanently removed, along with its photo if it had one, after a reasonable amount of time. | Solange dein Konto aktiv ist. Wenn du eine Erinnerung, einen Termin, einen Moment oder eine Zeitkapsel löschst, wird sie sofort als gelöscht markiert (du siehst sie nicht mehr) und nach angemessener Zeit endgültig entfernt, zusammen mit dem zugehörigen Foto, falls vorhanden. | Tant que ton compte est actif. Si tu supprimes un souvenir, une date, un moment ou une capsule temporelle, il est immédiatement marqué comme supprimé (tu ne le vois plus) et définitivement effacé, ainsi que la photo associée le cas échéant, après un délai raisonnable. |
| `privacy.retention.title` | Cuánto los conservamos | How long we keep it | Wie lange wir sie aufbewahren | Combien de temps nous les conservons |
| `privacy.rights.body` | Puedes acceder a tu contenido, exportarlo (ver "Exportar datos" en Ajustes) y pedir que lo corrijamos o lo borremos. Si necesitas algo que la app todavía no resuelve por tu cuenta, escríbenos (ver "Contacto" abajo). | You can access your content, export it (see "Export data" in Settings) and ask us to correct or delete it. If you need something the app doesn't yet handle on its own, write to us (see "Contact" below). | Du kannst auf deine Inhalte zugreifen, sie exportieren (siehe "Daten exportieren" in den Einstellungen) und uns bitten, sie zu berichtigen oder zu löschen. Wenn du etwas benötigst, das die App noch nicht selbst abdeckt, schreib uns (siehe "Kontakt" unten). | Tu peux accéder à ton contenu, l'exporter (voir "Exporter les données" dans les Paramètres) et nous demander de le corriger ou de le supprimer. Si tu as besoin de quelque chose que l'application ne gère pas encore seule, écris-nous (voir "Contact" ci-dessous). |
| `privacy.rights.title` | Tus derechos | Your rights | Deine Rechte | Tes droits |
| `privacy.security.body` | Tu contenido solo es visible para ti y tu pareja: la base de datos aplica reglas de acceso (Row Level Security) que impiden que otra cuenta lo lea, incluso si conociera el identificador. Las contraseñas nunca las vemos ni las guardamos nosotros: las maneja Supabase Auth. | Your content is only visible to you and your partner: the database enforces access rules (Row Level Security) that stop another account from reading it, even if they knew its identifier. We never see or store your password ourselves: it's handled by Supabase Auth. | Deine Inhalte sind nur für dich und deine Partnerin oder deinen Partner sichtbar: Die Datenbank setzt Zugriffsregeln (Row Level Security) durch, die verhindern, dass ein anderes Konto sie liest, selbst wenn es die Kennung kennen würde. Wir sehen oder speichern dein Passwort niemals selbst: Das übernimmt Supabase Auth. | Ton contenu n'est visible que par toi et ton ou ta partenaire : la base de données applique des règles d'accès (Row Level Security) qui empêchent un autre compte de le lire, même s'il en connaissait l'identifiant. Nous ne voyons ni ne stockons jamais ton mot de passe nous-mêmes : c'est Supabase Auth qui s'en charge. |
| `privacy.security.title` | Seguridad | Security | Sicherheit | Sécurité |
| `privacy.subprocessors.body` | Supabase aloja la base de datos, la autenticación, el almacenamiento de fotos y las funciones que hacen correr la app. Si activas notificaciones push, el navegador que uses (Google Chrome, Mozilla Firefox, Apple Safari, según el caso) recibe el envío para entregártelo — nosotros no elegimos eso, es cómo funciona el estándar Web Push. Cuando exista un plan de pago, se sumará aquí el proveedor de pagos correspondiente (Stripe o RevenueCat) antes de activarlo. | Supabase hosts the database, authentication, photo storage and the functions that run the app. If you turn on push notifications, the browser you use (Google Chrome, Mozilla Firefox, Apple Safari, depending on the case) receives the delivery to hand it to you — we don't choose that, it's how the Web Push standard works. Once a paid plan exists, the corresponding payment provider (Stripe or RevenueCat) will be added here before it's turned on. | Supabase hostet die Datenbank, die Authentifizierung, die Fotospeicherung und die Funktionen, die die App betreiben. Wenn du Push-Benachrichtigungen aktivierst, empfängt der von dir genutzte Browser (Google Chrome, Mozilla Firefox, Apple Safari, je nach Fall) die Zustellung, um sie dir zu übergeben — das entscheiden nicht wir, so funktioniert der Web-Push-Standard. Sobald es einen kostenpflichtigen Plan gibt, wird der entsprechende Zahlungsanbieter (Stripe oder RevenueCat) hier ergänzt, bevor er aktiviert wird. | Supabase héberge la base de données, l'authentification, le stockage des photos et les fonctions qui font tourner l'application. Si tu actives les notifications push, le navigateur que tu utilises (Google Chrome, Mozilla Firefox, Apple Safari, selon le cas) reçoit l'envoi pour te le remettre — ce n'est pas nous qui choisissons cela, c'est ainsi que fonctionne le standard Web Push. Dès qu'un plan payant existera, le prestataire de paiement correspondant (Stripe ou RevenueCat) sera ajouté ici avant son activation. |
| `privacy.subprocessors.title` | Con quién compartimos datos (subencargados) | Who we share data with (sub-processors) | Mit wem wir Daten teilen (Subunternehmer) | Avec qui nous partageons des données (sous-traitants) |
| `privacy.title` | Política de Privacidad | Privacy Policy | Datenschutzerklärung | Politique de confidentialité |
| `privacy.updated` | Última actualización: 24 de septiembre de 2026 | Last updated: September 24, 2026 | Letzte Aktualisierung: 24. September 2026 | Dernière mise à jour : 24 septembre 2026 |
| `storage.future.body` | Si en el futuro agregamos analítica (por ejemplo, para entender qué partes de la app se usan más) o una pasarela de pago como Stripe, eso sí requeriría pedirte consentimiento antes de cargar esos scripts, y esta página se actualizaría para reflejarlo. | If we add analytics in the future (for example, to understand which parts of the app get used the most) or a payment gateway like Stripe, that would require asking for your consent before loading those scripts, and this page would be updated to reflect it. | Wenn wir in Zukunft Analysen hinzufügen (zum Beispiel, um zu verstehen, welche Teile der App am meisten genutzt werden) oder ein Zahlungssystem wie Stripe, würde dies deine Einwilligung erfordern, bevor diese Skripte geladen werden, und diese Seite würde entsprechend aktualisiert. | Si nous ajoutons de l'analytique à l'avenir (par exemple, pour comprendre quelles parties de l'app sont le plus utilisées) ou une passerelle de paiement comme Stripe, cela nécessiterait de te demander ton consentement avant de charger ces scripts, et cette page serait mise à jour en conséquence. |
| `storage.future.title` | Si esto cambia | If this changes | Falls sich das ändert | Si cela change |
| `storage.intro` | Nuestra historia no usa cookies. Usa almacenamiento local del navegador (localStorage e IndexedDB) para unas pocas cosas concretas, todas necesarias para que la app funcione o para recordar una preferencia tuya — nada de esto es analítica ni rastreo. | Nuestra historia doesn't use cookies. It uses browser local storage (localStorage and IndexedDB) for a few specific things, all necessary for the app to work or to remember a preference of yours — none of this is analytics or tracking. | Nuestra historia verwendet keine Cookies. Es nutzt lokalen Browser-Speicher (localStorage und IndexedDB) für einige konkrete Dinge, die alle notwendig sind, damit die App funktioniert, oder um eine deiner Präferenzen zu merken — nichts davon ist Analyse oder Tracking. | Nuestra historia n'utilise pas de cookies. L'application utilise le stockage local du navigateur (localStorage et IndexedDB) pour quelques éléments précis, tous nécessaires au fonctionnement de l'app ou pour mémoriser une de tes préférences — rien de tout cela n'est de l'analytique ni du pistage. |
| `storage.language.body` | Guardamos el idioma que elegiste (clave "nh_lang") para no tener que adivinarlo de nuevo en cada visita. | We store the language you chose (key "nh_lang") so we don't have to guess it again on every visit. | Wir speichern die von dir gewählte Sprache (Schlüssel "nh_lang"), damit wir sie nicht bei jedem Besuch erneut erraten müssen. | Nous stockons la langue que tu as choisie (clé "nh_lang") pour ne pas avoir à la redeviner à chaque visite. |
| `storage.language.title` | Tu idioma | Your language | Deine Sprache | Ta langue |
| `storage.noCookies.body` | Bajo el RGPD y la directiva ePrivacy, ese aviso solo es obligatorio cuando se usan cookies (u otro almacenamiento) que no son estrictamente necesarias, como las de analítica o publicidad. Lo que guardamos hoy es o bien estrictamente necesario (tu sesión) o de bajo riesgo y claramente funcional (idioma, tema), así que no aplica ese requisito por ahora. | Under GDPR and the ePrivacy directive, that banner is only required when using cookies (or other storage) that aren't strictly necessary, like analytics or advertising ones. What we store today is either strictly necessary (your session) or low-risk and clearly functional (language, theme), so that requirement doesn't apply for now. | Nach DSGVO und ePrivacy-Richtlinie ist dieser Hinweis nur erforderlich, wenn Cookies (oder anderer Speicher) verwendet werden, die nicht unbedingt erforderlich sind, wie Analyse- oder Werbe-Cookies. Was wir heute speichern, ist entweder unbedingt erforderlich (deine Sitzung) oder risikoarm und eindeutig funktional (Sprache, Design), sodass diese Anforderung derzeit nicht gilt. | Selon le RGPD et la directive ePrivacy, ce bandeau n'est requis que pour des cookies (ou un autre stockage) qui ne sont pas strictement nécessaires, comme ceux d'analytique ou de publicité. Ce que nous stockons aujourd'hui est soit strictement nécessaire (ta session), soit à faible risque et clairement fonctionnel (langue, thème), donc cette exigence ne s'applique pas pour l'instant. |
| `storage.noCookies.title` | Por qué no hay un aviso de cookies con "Aceptar" | Why there's no "Accept" cookie banner | Warum es keinen Cookie-Banner mit "Akzeptieren" gibt | Pourquoi il n'y a pas de bandeau cookies avec "Accepter" |
| `storage.offlineCache.body` | Para que puedas seguir viendo tus recuerdos, fechas y momentos sin internet, guardamos una copia de esos datos en IndexedDB (clave "nh-query-cache"), el almacenamiento local del navegador pensado para volúmenes más grandes que una cookie. Se borra solo si borras los datos del sitio desde tu navegador. | So you can keep seeing your memories, dates and moments without internet, we store a copy of that data in IndexedDB (key "nh-query-cache"), the browser's local storage meant for larger volumes than a cookie. It's only cleared if you clear the site's data from your browser. | Damit du deine Erinnerungen, Termine und Momente auch ohne Internet weiter sehen kannst, speichern wir eine Kopie dieser Daten in IndexedDB (Schlüssel "nh-query-cache"), dem für größere Datenmengen als ein Cookie gedachten lokalen Browser-Speicher. Er wird nur gelöscht, wenn du die Seitendaten in deinem Browser löschst. | Pour que tu puisses continuer à voir tes souvenirs, dates et moments sans internet, nous stockons une copie de ces données dans IndexedDB (clé "nh-query-cache"), le stockage local du navigateur prévu pour des volumes plus importants qu'un cookie. Il n'est effacé que si tu effaces les données du site depuis ton navigateur. |
| `storage.offlineCache.title` | Modo sin conexión | Offline mode | Offline-Modus | Mode hors ligne |
| `storage.session.body` | Supabase guarda tu token de sesión en localStorage (una clave que empieza con "sb-") para que no tengas que iniciar sesión cada vez que abres la app. Es estrictamente necesario: sin esto, no podrías quedarte conectado. | Supabase stores your session token in localStorage (a key starting with "sb-") so you don't have to log in every time you open the app. It's strictly necessary: without it, you couldn't stay signed in. | Supabase speichert dein Sitzungs-Token in localStorage (ein Schlüssel, der mit "sb-" beginnt), damit du dich nicht jedes Mal neu anmelden musst, wenn du die App öffnest. Es ist unbedingt erforderlich: ohne es könntest du nicht angemeldet bleiben. | Supabase stocke ton jeton de session dans localStorage (une clé qui commence par "sb-") pour que tu n'aies pas à te reconnecter à chaque ouverture de l'app. C'est strictement nécessaire : sans cela, tu ne pourrais pas rester connecté(e). |
| `storage.session.title` | Tu sesión | Your session | Deine Sitzung | Ta session |
| `storage.theme.body` | Guardamos si preferiste el tema claro u oscuro (clave "nh-web-theme"). Si no eliges ninguno, seguimos el tema del sistema operativo y no guardamos nada. | We store whether you preferred light or dark theme (key "nh-web-theme"). If you don't pick one, we follow your operating system's theme and store nothing. | Wir speichern, ob du das helle oder dunkle Design bevorzugst (Schlüssel "nh-web-theme"). Wenn du keines auswählst, folgen wir dem Design deines Betriebssystems und speichern nichts. | Nous stockons si tu préfères le thème clair ou sombre (clé "nh-web-theme"). Si tu n'en choisis aucun, nous suivons le thème de ton système d'exploitation et ne stockons rien. |
| `storage.theme.title` | Tu tema (claro/oscuro) | Your theme (light/dark) | Dein Design (hell/dunkel) | Ton thème (clair/sombre) |
| `storage.title` | Qué guardamos en tu dispositivo | What we store on your device | Was wir auf deinem Gerät speichern | Ce que nous stockons sur ton appareil |
| `storage.updated` | Última actualización: 24 de septiembre de 2026 | Last updated: September 24, 2026 | Letzte Aktualisierung: 24. September 2026 | Dernière mise à jour : 24 septembre 2026 |
| `terms.acceptableUse.body` | No uses la app para subir contenido ilegal, para acosar a otra persona, para intentar acceder a cuentas que no son tuyas, ni para sobrecargar o interferir con el servicio de forma deliberada. | Don't use the app to upload illegal content, to harass another person, to try to access accounts that aren't yours, or to deliberately overload or interfere with the service. | Nutze die App nicht, um illegale Inhalte hochzuladen, eine andere Person zu belästigen, zu versuchen, auf nicht dir gehörende Konten zuzugreifen, oder den Dienst absichtlich zu überlasten oder zu stören. | N'utilise pas l'application pour publier du contenu illégal, harceler une autre personne, tenter d'accéder à des comptes qui ne sont pas les tiens, ou perturber ou surcharger délibérément le service. |
| `terms.acceptableUse.title` | Uso aceptable | Acceptable use | Zulässige Nutzung | Utilisation acceptable |
| `terms.acceptance.body` | Usar la app implica que aceptas estos Términos y la Política de Privacidad. Si no estás de acuerdo, no debes crear una cuenta ni usar el servicio. | Using the app means you accept these Terms and the Privacy Policy. If you don't agree, you must not create an account or use the service. | Die Nutzung der App bedeutet, dass du diese Bedingungen und die Datenschutzerklärung akzeptierst. Wenn du nicht einverstanden bist, darfst du kein Konto erstellen oder den Dienst nutzen. | Utiliser l'application signifie que tu acceptes ces Conditions et la Politique de confidentialité. Si tu n'es pas d'accord, tu ne dois pas créer de compte ni utiliser le service. |
| `terms.acceptance.title` | Aceptación | Acceptance | Zustimmung | Acceptation |
| `terms.account.body` | Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad que ocurra en tu cuenta. Avísanos si crees que alguien más accedió a ella sin tu permiso. | You're responsible for keeping your password confidential and for any activity that happens on your account. Let us know if you think someone else accessed it without your permission. | Du bist dafür verantwortlich, dein Passwort vertraulich zu behandeln, sowie für jede Aktivität, die über dein Konto erfolgt. Informiere uns, wenn du vermutest, dass jemand ohne deine Erlaubnis darauf zugegriffen hat. | Tu es responsable de garder ton mot de passe confidentiel et de toute activité se produisant sur ton compte. Préviens-nous si tu penses que quelqu'un d'autre y a accédé sans ta permission. |
| `terms.account.title` | Tu cuenta | Your account | Dein Konto | Ton compte |
| `terms.changes.body` | Si hacemos cambios importantes, actualizaremos la fecha de arriba y, si el cambio es significativo, te avisaremos dentro de la app. | If we make significant changes, we'll update the date above and, if the change is significant, we'll notify you inside the app. | Bei wesentlichen Änderungen aktualisieren wir das Datum oben und benachrichtigen dich in der App, falls die Änderung bedeutend ist. | En cas de changement important, nous mettrons à jour la date ci-dessus et, si le changement est significatif, nous t'en informerons dans l'application. |
| `terms.changes.title` | Cambios a estos Términos | Changes to these Terms | Änderungen dieser Bedingungen | Modifications de ces Conditions |
| `terms.contact.body` | Para cualquier duda sobre estos Términos, escribe a legal@nuestrahistoria.app (dirección de contacto provisional, pendiente de configurar sobre el dominio definitivo). | For any question about these Terms, write to legal@nuestrahistoria.app (temporary contact address, pending setup on the final domain). | Bei Fragen zu diesen Bedingungen schreib an legal@nuestrahistoria.app (vorläufige Kontaktadresse, die Einrichtung auf der endgültigen Domain steht noch aus). | Pour toute question concernant ces Conditions, écris à legal@nuestrahistoria.app (adresse de contact provisoire, en attente de configuration sur le domaine définitif). |
| `terms.contact.title` | Contacto | Contact | Kontakt | Contact |
| `terms.content.body` | Lo que creas (recuerdos, fotos, fechas, momentos, cápsulas del tiempo) es tuyo. Nos das permiso únicamente para almacenarlo y mostrártelo a ti y a tu pareja, con el único fin de prestarte el servicio. Eres responsable de que tengas derecho a subir lo que subes. | What you create (memories, photos, dates, moments, time capsules) is yours. You grant us permission only to store it and show it to you and your partner, for the sole purpose of providing the service. You're responsible for having the right to upload what you upload. | Was du erstellst (Erinnerungen, Fotos, Termine, Momente, Zeitkapseln), gehört dir. Du gestattest uns lediglich, es zu speichern und dir und deiner Partnerin oder deinem Partner anzuzeigen, ausschließlich zum Zweck der Diensterbringung. Du bist dafür verantwortlich, dass du berechtigt bist, das Hochgeladene hochzuladen. | Ce que tu crées (souvenirs, photos, dates, moments, capsules temporelles) t'appartient. Tu nous autorises uniquement à le stocker et à te l'afficher, à toi et à ton ou ta partenaire, dans le seul but de fournir le service. Tu es responsable d'avoir le droit de publier ce que tu publies. |
| `terms.content.title` | Tu contenido | Your content | Deine Inhalte | Ton contenu |
| `terms.intro` | Al crear una cuenta en Nuestra historia aceptas estos términos. No es asesoría legal: es una descripción clara de las reglas bajo las que ofrecemos el servicio. | By creating an account on Nuestra historia you accept these terms. This is not legal advice: it's a clear description of the rules under which we offer the service. | Mit der Erstellung eines Kontos bei Nuestra historia akzeptierst du diese Bedingungen. Dies ist keine Rechtsberatung, sondern eine klare Beschreibung der Regeln, unter denen wir den Dienst anbieten. | En créant un compte sur Nuestra historia, tu acceptes ces conditions. Ceci n'est pas un conseil juridique : c'est une description claire des règles selon lesquelles nous proposons le service. |
| `terms.law.body` | Estos Términos se rigen por las leyes de Colombia. Cualquier disputa se someterá a los jueces y tribunales competentes en Colombia, sin perjuicio de los derechos de protección al consumidor que te correspondan por residir en otro país. | These Terms are governed by the laws of Colombia. Any dispute will be submitted to the competent courts in Colombia, without prejudice to any consumer-protection rights you may have as a resident of another country. | Diese Bedingungen unterliegen dem Recht Kolumbiens. Streitigkeiten werden den zuständigen Gerichten in Kolumbien vorgelegt, unbeschadet etwaiger Verbraucherschutzrechte, die dir als Einwohner eines anderen Landes zustehen. | Ces Conditions sont régies par le droit colombien. Tout litige sera soumis aux juridictions compétentes en Colombie, sans préjudice des droits de protection des consommateurs dont tu pourrais bénéficier en tant que résident d'un autre pays. |
| `terms.law.title` | Ley aplicable y jurisdicción | Governing law and jurisdiction | Anwendbares Recht und Gerichtsstand | Droit applicable et juridiction |
| `terms.liability.body` | El servicio se ofrece "tal cual", sin garantías de disponibilidad continua. En la medida permitida por la ley, no somos responsables por daños indirectos derivados del uso o la imposibilidad de uso de la app, ni por la pérdida de contenido fuera de lo que cubren nuestras copias de seguridad habituales. | The service is provided "as is", without guarantees of continuous availability. To the extent permitted by law, we're not liable for indirect damages arising from use or inability to use the app, nor for loss of content beyond what our regular backups cover. | Der Dienst wird "wie besehen" bereitgestellt, ohne Garantie für ununterbrochene Verfügbarkeit. Soweit gesetzlich zulässig, haften wir nicht für indirekte Schäden aus der Nutzung oder Nichtnutzbarkeit der App, noch für Datenverluste, die über unsere üblichen Sicherungen hinausgehen. | Le service est fourni "tel quel", sans garantie de disponibilité continue. Dans la mesure permise par la loi, nous ne sommes pas responsables des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser l'application, ni de la perte de contenu au-delà de ce que couvrent nos sauvegardes habituelles. |
| `terms.liability.title` | Limitación de responsabilidad | Limitation of liability | Haftungsbeschränkung | Limitation de responsabilité |
| `terms.minAge.body` | Nuestra historia no está dirigida a menores de 16 años. Al registrarte declaras que tienes al menos esa edad. | Nuestra historia is not directed at anyone under 16. By registering you declare that you are at least that age. | Nuestra historia richtet sich nicht an Personen unter 16 Jahren. Mit der Registrierung erklärst du, dass du mindestens dieses Alter erreicht hast. | Nuestra historia ne s'adresse pas aux personnes de moins de 16 ans. En t'inscrivant, tu déclares avoir au moins cet âge. |
| `terms.minAge.title` | Edad mínima | Minimum age | Mindestalter | Âge minimum |
| `terms.termination.body` | Podemos suspender o cerrar una cuenta que incumpla estos Términos, especialmente la sección de Uso aceptable. Tú puedes dejar de usar el servicio y pedir el borrado de tu cuenta en cualquier momento (ver la Política de Privacidad, sección "Borrar tu cuenta"). | We may suspend or close an account that breaches these Terms, especially the Acceptable use section. You can stop using the service and request deletion of your account at any time (see the Privacy Policy, "Deleting your account" section). | Wir können ein Konto sperren oder schließen, das gegen diese Bedingungen verstößt, insbesondere gegen den Abschnitt zur zulässigen Nutzung. Du kannst die Nutzung des Dienstes jederzeit beenden und die Löschung deines Kontos beantragen (siehe Datenschutzerklärung, Abschnitt "Dein Konto löschen"). | Nous pouvons suspendre ou clôturer un compte qui enfreint ces Conditions, en particulier la section Utilisation acceptable. Tu peux cesser d'utiliser le service et demander la suppression de ton compte à tout moment (voir la Politique de confidentialité, section "Supprimer ton compte"). |
| `terms.termination.title` | Suspensión y cierre de cuenta | Suspension and account closure | Sperrung und Kontoschließung | Suspension et clôture de compte |
| `terms.title` | Términos y Condiciones | Terms and Conditions | Allgemeine Geschäftsbedingungen | Conditions générales |
| `terms.updated` | Última actualización: 24 de septiembre de 2026 | Last updated: September 24, 2026 | Letzte Aktualisierung: 24. September 2026 | Dernière mise à jour : 24 septembre 2026 |

## `memories` (22 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.delete` | Eliminar | Delete | Löschen | Supprimer |
| `action.favorite` | Marcar como favorito | Mark as favorite | Als Favorit markieren | Marquer comme favori |
| `action.new` | Nuevo recuerdo | New memory | Neue Erinnerung | Nouveau souvenir |
| `action.save` | Guardar recuerdo | Save memory | Erinnerung speichern | Enregistrer le souvenir |
| `confirm.delete` | ¿Eliminar este recuerdo? | Delete this memory? | Diese Erinnerung löschen? | Supprimer ce souvenir ? |
| `empty.subtitle` | Guarda un momento con fecha y lo que sintieron. | Save a moment with a date and how you felt. | Speichere einen Moment mit Datum und wie ihr euch gefühlt habt. | Enregistrez un moment avec une date et ce que vous avez ressenti. |
| `empty.title` | Aquí vivirán sus recuerdos | Your memories will live here | Hier landen eure Erinnerungen | Vos souvenirs vivront ici |
| `error.save` | No se pudo guardar el recuerdo. | Couldn't save the memory. | Erinnerung konnte nicht gespeichert werden. | Impossible d'enregistrer le souvenir. |
| `field.body` | Lo que quieres recordar | What you want to remember | Was du dir merken möchtest | Ce que vous voulez retenir |
| `field.date` | Fecha | Date | Datum | Date |
| `field.photo` | Foto | Photo | Foto | Photo |
| `field.place` | Lugar | Place | Ort | Lieu |
| `field.tag` | Tipo | Type | Art | Type |
| `field.title` | Título | Title | Titel | Titre |
| `nav` | Recuerdos | Memories | Erinnerungen | Souvenirs |
| `new.title` | Nuevo recuerdo | New memory | Neue Erinnerung | Nouveau souvenir |
| `tag.charla` | Conversación | Conversation | Gespräch | Conversation |
| `tag.cita` | Cita | Date | Date | Rendez-vous |
| `tag.detalle` | Detalle | Gift | Geschenk | Cadeau |
| `tag.logro` | Logro | Milestone | Meilenstein | Étape importante |
| `tag.otro` | Otro | Other | Sonstiges | Autre |
| `tag.viaje` | Viaje | Trip | Reise | Voyage |

## `momentTemplates` (17 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.unpublish` | Dejar de compartir | Stop sharing | Nicht mehr teilen | Ne plus partager |
| `action.use` | Usar esta plantilla | Use this template | Diese Vorlage nutzen | Utiliser ce modèle |
| `confirm.delete` | ¿Dejar de compartir esta plantilla? Ya no aparecerá para otras parejas. | Stop sharing this template? It'll no longer show up for other couples. | Diese Vorlage nicht mehr teilen? Sie erscheint dann nicht mehr bei anderen Paaren. | Ne plus partager ce modèle ? Il n'apparaîtra plus pour les autres couples. |
| `empty.subtitle` | Sé la primera pareja en compartir un diseño desde Momentos. | Be the first couple to share a design from Moments. | Sei das erste Paar, das ein Design aus Momenten teilt. | Soyez le premier couple à partager un design depuis Moments. |
| `empty.title` | Todavía no hay plantillas | No templates yet | Noch keine Vorlagen | Pas encore de modèles |
| `intro` | Diseños que otras parejas compartieron. Úsalos como punto de partida para su propio Momento; la fecha y la foto siempre las eligen ustedes. | Designs other couples have shared. Use them as a starting point for your own Moment; the date and photo are always yours to choose. | Designs, die andere Paare geteilt haben. Nutze sie als Ausgangspunkt für euren eigenen Moment; Datum und Foto wählt ihr immer selbst. | Des designs que d'autres couples ont partagés. Utilisez-les comme point de départ pour votre propre Moment ; la date et la photo restent toujours votre choix. |
| `modal.title` | Usar plantilla | Use template | Vorlage nutzen | Utiliser le modèle |
| `publish.action` | Publicar plantilla | Publish template | Vorlage veröffentlichen | Publier le modèle |
| `publish.close` | Cerrar | Close | Schließen | Fermer |
| `publish.error` | No se pudo publicar. Intenta de nuevo. | Couldn't publish. Try again. | Konnte nicht veröffentlicht werden. Versuch es noch einmal. | Impossible de publier. Réessayez. |
| `publish.field.message` | Mensaje de ejemplo | Sample message | Beispielnachricht | Message d'exemple |
| `publish.field.tagline` | Frase corta | Short tagline | Kurztext | Phrase courte |
| `publish.field.title` | Título público | Public title | Öffentlicher Titel | Titre public |
| `publish.hint` | Se comparte con otras parejas: el título, el texto y el mensaje que pongas aquí serán públicos. No incluyas nombres, fechas ni nada personal. | This gets shared with other couples: the title, tagline and message you write here will be public. Don't include names, dates, or anything personal. | Das wird mit anderen Paaren geteilt: Titel, Kurztext und Nachricht, die du hier schreibst, sind öffentlich. Keine Namen, Daten oder Persönliches angeben. | Ceci est partagé avec d'autres couples : le titre, la phrase et le message que vous écrivez ici seront publics. N'incluez ni noms, ni dates, ni rien de personnel. |
| `publish.success` | Publicada. Ya aparece en Plantillas para cualquier pareja. | Published. It now shows up in Templates for any couple. | Veröffentlicht. Sie erscheint jetzt bei Vorlagen für jedes Paar. | Publié. Il apparaît maintenant dans Modèles pour tous les couples. |
| `publish.title` | Compartir como plantilla | Share as a template | Als Vorlage teilen | Partager comme modèle |
| `title` | Plantillas de la comunidad | Community templates | Vorlagen der Community | Modèles de la communauté |

## `moments` (61 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.close` | Cerrar | Close | Schließen | Fermer |
| `action.delete` | Eliminar | Delete | Löschen | Supprimer |
| `action.edit` | Editar | Edit | Bearbeiten | Modifier |
| `action.new` | Nuevo momento | New moment | Neuer Moment | Nouveau moment |
| `action.open` | Abrir escena | Open scene | Szene öffnen | Ouvrir la scène |
| `action.save` | Guardar momento | Save moment | Moment speichern | Enregistrer le moment |
| `action.share` | Compartir como plantilla | Share as template | Als Vorlage teilen | Partager comme modèle |
| `confirm.delete` | ¿Eliminar este momento? | Delete this moment? | Diesen Moment löschen? | Supprimer ce moment ? |
| `countdown.in_one` | Falta {{count}} día | {{count}} day to go | Noch {{count}} Tag | Dans {{count}} jour |
| `countdown.in_other` | Faltan {{count}} días | {{count}} days to go | Noch {{count}} Tage | Dans {{count}} jours |
| `countdown.past_one` | Fue hace {{count}} día | {{count}} day ago | Vor {{count}} Tag | Il y a {{count}} jour |
| `countdown.past_other` | Fue hace {{count}} días | {{count}} days ago | Vor {{count}} Tagen | Il y a {{count}} jours |
| `countdown.today` | Hoy | Today | Heute | Aujourd'hui |
| `culturalDates.link` | Ver fechas culturales sugeridas → | See suggested cultural dates → | Vorgeschlagene kulturelle Daten ansehen → | Voir les dates culturelles suggérées → |
| `edit.title` | Editar momento | Edit moment | Moment bearbeiten | Modifier le moment |
| `empty.subtitle` | Diseña un día solo de ustedes, como el Día de las flores amarillas. | Design a day just for the two of you, like the Yellow Flowers Day. | Gestaltet einen Tag nur für euch, wie den Tag der gelben Blumen. | Concevez une journée rien qu'à vous, comme la Journée des fleurs jaunes. |
| `empty.title` | Todavía no hay momentos especiales | No special moments yet | Noch keine besonderen Momente | Pas encore de moments spéciaux |
| `error.save` | No se pudo guardar el momento. | Couldn't save the moment. | Moment konnte nicht gespeichert werden. | Impossible d'enregistrer le moment. |
| `field.accent` | Acento | Accent | Akzent | Accent |
| `field.bg1` | Fondo arriba | Top background | Hintergrund oben | Fond en haut |
| `field.bg2` | Fondo abajo | Bottom background | Hintergrund unten | Fond en bas |
| `field.date` | Fecha | Date | Datum | Date |
| `field.density` | Cantidad | Amount | Menge | Quantité |
| `field.emoji` | Emoji | Emoji | Emoji | Emoji |
| `field.font` | Tipografía | Typeface | Schriftart | Police |
| `field.ink` | Texto | Text | Text | Texte |
| `field.message` | Mensaje | Message | Nachricht | Message |
| `field.motif` | Figura animada | Animated shape | Animierte Form | Motif animé |
| `field.name` | Nombre del momento | Moment name | Name des Moments | Nom du moment |
| `field.palette` | Colores | Colors | Farben | Couleurs |
| `field.photo` | Foto | Photo | Foto | Photo |
| `field.plan` | Plan para ese día | Plan for that day | Plan für diesen Tag | Plan pour ce jour |
| `field.repeat` | Se repite | Repeats | Wiederholung | Répétition |
| `field.speed` | Velocidad | Speed | Geschwindigkeit | Vitesse |
| `field.tagline` | Frase principal | Main phrase | Hauptsatz | Phrase principale |
| `font.hand` | Manuscrita | Handwritten | Handschrift | Manuscrite |
| `font.sans` | Limpia | Clean | Schlicht | Épurée |
| `font.serif` | Clásica | Classic | Klassisch | Classique |
| `motif.corazones` | Corazones | Hearts | Herzen | Cœurs |
| `motif.destellos` | Destellos | Sparkles | Glitzer | Étincelles |
| `motif.emoji` | Emoji propio | Custom emoji | Eigenes Emoji | Emoji personnalisé |
| `motif.estrellas` | Estrellas | Stars | Sterne | Étoiles |
| `motif.flores` | Flores | Flowers | Blumen | Fleurs |
| `motif.mariposas` | Mariposas | Butterflies | Schmetterlinge | Papillons |
| `motif.petalos` | Pétalos | Petals | Blütenblätter | Pétales |
| `nav` | Momentos | Moments | Momente | Moments |
| `new.title` | Diseñar un momento | Design a moment | Moment gestalten | Concevoir un moment |
| `plan.add` | Agregar | Add | Hinzufügen | Ajouter |
| `plan.placeholder` | Por ejemplo: videollamada de noche | e.g. Video call at night | z. B. Videoanruf am Abend | Par ex. appel vidéo le soir |
| `plan.remove` | Quitar | Remove | Entfernen | Retirer |
| `repeat.none` | No se repite | Doesn't repeat | Wiederholt sich nicht | Ne se répète pas |
| `repeat.yearly` | Cada año | Every year | Jedes Jahr | Chaque année |
| `scene.confetti` | Lanzar confeti | Launch confetti | Konfetti auslösen | Lancer des confettis |
| `template.aniversario` | Aniversario | Anniversary | Jahrestag | Anniversaire de couple |
| `template.blanco` | Desde cero | From scratch | Von vorn | Depuis le début |
| `template.cumple` | Cumpleaños | Birthday | Geburtstag | Anniversaire |
| `template.estrellas` | Noche de estrellas | Night of stars | Sternennacht | Nuit d'étoiles |
| `template.flores` | Flores amarillas | Yellow flowers | Gelbe Blumen | Fleurs jaunes |
| `template.reencuentro` | Reencuentro | Reunion | Wiedersehen | Retrouvailles |
| `templates.link` | Ver plantillas de la comunidad → | See community templates → | Vorlagen der Community ansehen → | Voir les modèles de la communauté → |
| `templates.title` | Empezar desde una plantilla | Start from a template | Mit einer Vorlage beginnen | Partir d'un modèle |

## `premium` (20 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `billing.hint` | Los pagos con tarjeta todavía no están conectados. Por ahora, mientras se integra, puedes activar Premium manualmente aquí abajo para probarlo. | Card payments aren't connected yet. While that's being set up, you can turn on Premium manually below to try it out. | Kartenzahlungen sind noch nicht angebunden. Solange das eingerichtet wird, kannst du Premium unten manuell aktivieren, um es auszuprobieren. | Les paiements par carte ne sont pas encore connectés. En attendant, vous pouvez activer Premium manuellement ci-dessous pour l'essayer. |
| `currentPlan` | Plan actual | Current plan | Aktueller Plan | Forfait actuel |
| `devToggle.activate` | Activar Premium (modo de prueba) | Activate Premium (test mode) | Premium aktivieren (Testmodus) | Activer Premium (mode test) |
| `devToggle.deactivate` | Volver al plan gratis | Back to the free plan | Zurück zum kostenlosen Plan | Revenir au forfait gratuit |
| `feature.freeLimit_one` | {{count}} en el plan gratis | {{count}} on the free plan | {{count}} im kostenlosen Plan | {{count}} dans le forfait gratuit |
| `feature.freeLimit_other` | {{count}} en el plan gratis | {{count}} on the free plan | {{count}} im kostenlosen Plan | {{count}} dans le forfait gratuit |
| `feature.moments` | Momentos guardados | Saved moments | Gespeicherte Momente | Moments enregistrés |
| `feature.photos` | Fotos (recuerdos + momentos) | Photos (memories + moments) | Fotos (Erinnerungen + Momente) | Photos (souvenirs + moments) |
| `feature.timeCapsules` | Cápsulas del tiempo | Time capsules | Zeitkapseln | Capsules temporelles |
| `feature.unlimited` | ilimitado en Premium | unlimited on Premium | unbegrenzt mit Premium | illimité avec Premium |
| `limit.moments_one` | Llegaste al límite de {{count}} momento del plan gratis. Hazte Premium para momentos ilimitados. | You've hit the free plan's limit of {{count}} moment. Go Premium for unlimited moments. | Du hast das Limit von {{count}} Moment im kostenlosen Plan erreicht. Hol dir Premium für unbegrenzte Momente. | Vous avez atteint la limite de {{count}} moment du forfait gratuit. Passez à Premium pour des moments illimités. |
| `limit.moments_other` | Llegaste al límite de {{count}} momentos del plan gratis. Hazte Premium para momentos ilimitados. | You've hit the free plan's limit of {{count}} moments. Go Premium for unlimited moments. | Du hast das Limit von {{count}} Momenten im kostenlosen Plan erreicht. Hol dir Premium für unbegrenzte Momente. | Vous avez atteint la limite de {{count}} moments du forfait gratuit. Passez à Premium pour des moments illimités. |
| `limit.photos_one` | Llegaste al límite de {{count}} foto del plan gratis. Hazte Premium para fotos ilimitadas. | You've hit the free plan's limit of {{count}} photo. Go Premium for unlimited photos. | Du hast das Limit von {{count}} Foto im kostenlosen Plan erreicht. Hol dir Premium für unbegrenzte Fotos. | Vous avez atteint la limite de {{count}} photo du forfait gratuit. Passez à Premium pour des photos illimitées. |
| `limit.photos_other` | Llegaste al límite de {{count}} fotos del plan gratis. Hazte Premium para fotos ilimitadas. | You've hit the free plan's limit of {{count}} photos. Go Premium for unlimited photos. | Du hast das Limit von {{count}} Fotos im kostenlosen Plan erreicht. Hol dir Premium für unbegrenzte Fotos. | Vous avez atteint la limite de {{count}} photos du forfait gratuit. Passez à Premium pour des photos illimitées. |
| `limit.timeCapsules_one` | Llegaste al límite de {{count}} cápsula del tiempo del plan gratis. Hazte Premium para cápsulas ilimitadas. | You've hit the free plan's limit of {{count}} time capsule. Go Premium for unlimited capsules. | Du hast das Limit von {{count}} Zeitkapsel im kostenlosen Plan erreicht. Hol dir Premium für unbegrenzte Kapseln. | Vous avez atteint la limite de {{count}} capsule temporelle du forfait gratuit. Passez à Premium pour des capsules illimitées. |
| `limit.timeCapsules_other` | Llegaste al límite de {{count}} cápsulas del tiempo del plan gratis. Hazte Premium para cápsulas ilimitadas. | You've hit the free plan's limit of {{count}} time capsules. Go Premium for unlimited capsules. | Du hast das Limit von {{count}} Zeitkapseln im kostenlosen Plan erreicht. Hol dir Premium für unbegrenzte Kapseln. | Vous avez atteint la limite de {{count}} capsules temporelles du forfait gratuit. Passez à Premium pour des capsules illimitées. |
| `plan.free` | Gratis | Free | Kostenlos | Gratuit |
| `plan.premium` | Premium | Premium | Premium | Premium |
| `title` | Nuestra historia Premium | Our Story Premium | Unsere Geschichte Premium | Notre histoire Premium |
| `upsell.cta` | Ver Premium | See Premium | Premium ansehen | Voir Premium |

## `push` (6 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.disable` | Desactivar notificaciones | Disable notifications | Benachrichtigungen deaktivieren | Désactiver les notifications |
| `action.enable` | Activar notificaciones | Enable notifications | Benachrichtigungen aktivieren | Activer les notifications |
| `error.generic` | No se pudo activar. Intenta de nuevo. | Couldn't turn this on. Try again. | Konnte nicht aktiviert werden. Versuch es noch einmal. | Impossible d'activer. Réessayez. |
| `error.permissionDenied` | Bloqueaste los permisos de notificación en el navegador. Puedes habilitarlos desde la configuración del sitio. | You've blocked notification permissions in the browser. You can re-enable them from the site settings. | Du hast Benachrichtigungen im Browser blockiert. Du kannst sie in den Website-Einstellungen wieder erlauben. | Vous avez bloqué les autorisations de notification dans le navigateur. Vous pouvez les réactiver depuis les paramètres du site. |
| `hint` | Recibe un aviso el día antes de una fecha especial o un momento programado. | Get a heads-up the day before a special date or a scheduled Moment. | Erhalte einen Hinweis am Tag vor einem besonderen Datum oder einem geplanten Moment. | Recevez un rappel la veille d'une date spéciale ou d'un Moment programmé. |
| `title` | Notificaciones | Notifications | Benachrichtigungen | Notifications |

## `timecapsules` (17 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.delete` | Eliminar | Delete | Löschen | Supprimer |
| `action.new` | Nueva cápsula | New capsule | Neue Zeitkapsel | Nouvelle capsule |
| `action.save` | Sellar cápsula | Seal capsule | Kapsel versiegeln | Sceller la capsule |
| `confirm.delete` | ¿Eliminar esta cápsula? | Delete this capsule? | Diese Kapsel löschen? | Supprimer cette capsule ? |
| `empty.subtitle` | Escribe algo para tu futuro yo, o para tu pareja en una fecha especial. | Write something for your future self, or for your partner on a special date. | Schreib etwas für dein zukünftiges Ich oder für deine Partnerin/deinen Partner zu einem besonderen Datum. | Écrivez quelque chose pour votre futur vous, ou pour votre partenaire à une date spéciale. |
| `empty.title` | Todavía no hay cápsulas | No capsules yet | Noch keine Zeitkapseln | Pas encore de capsules |
| `error.save` | No se pudo guardar. Intenta de nuevo. | Couldn't save. Try again. | Konnte nicht gespeichert werden. Versuch es noch einmal. | Impossible d'enregistrer. Réessayez. |
| `field.body` | Tu mensaje | Your message | Deine Nachricht | Votre message |
| `field.openOn` | Se revela el | Reveals on | Wird enthüllt am | Révélée le |
| `field.title` | Título | Title | Titel | Titre |
| `hint.onlyYouSeeIt` | Solo tú la ves hasta que llegue la fecha. | Only you can see it until the date arrives. | Nur du siehst sie, bis das Datum erreicht ist. | Vous seul·e la voyez jusqu'à la date choisie. |
| `intro` | Escribe un mensaje hoy y elige cuándo se revela. Hasta esa fecha, solo tú puedes verlo. | Write a message today and choose when it's revealed. Until then, only you can see it. | Schreib heute eine Nachricht und wähle, wann sie enthüllt wird. Bis dahin siehst nur du sie. | Écrivez un message aujourd'hui et choisissez quand il sera révélé. Jusque-là, vous seul·e pouvez le voir. |
| `nav` | Cápsulas | Capsules | Zeitkapseln | Capsules |
| `new.title` | Nueva cápsula del tiempo | New time capsule | Neue Zeitkapsel | Nouvelle capsule temporelle |
| `sealed.hint` | Cápsula sellada hasta el {{date}}. | Sealed until {{date}}. | Versiegelt bis zum {{date}}. | Scellée jusqu'au {{date}}. |
| `status.open` | Revelada | Revealed | Enthüllt | Révélée |
| `status.sealed` | Sellada | Sealed | Versiegelt | Scellée |

## `yearreview` (15 claves)

| Clave | es (referencia) | en (referencia) | de (a revisar) | fr (a revisar) |
| --- | --- | --- | --- | --- |
| `action.download` | Descargar como imagen | Download as image | Als Bild herunterladen | Télécharger en image |
| `appName` | Nuestra historia | Our Story | Unsere Geschichte | Notre histoire |
| `daysTogether` | días juntos | days together | Tage zusammen | jours ensemble |
| `noDaysYet` | Todavía no empezaba su historia en este año. | Your story hadn't started yet in this year. | In diesem Jahr hatte eure Geschichte noch nicht begonnen. | Votre histoire n'avait pas encore commencé cette année-là. |
| `stat.dates_one` | fecha especial | special date | besonderes Datum | date spéciale |
| `stat.dates_other` | fechas especiales | special dates | besondere Daten | dates spéciales |
| `stat.encounters_one` | encuentro | time together | Treffen | rencontre |
| `stat.encounters_other` | encuentros | times together | Treffen | rencontres |
| `stat.memories_one` | recuerdo guardado | memory saved | gespeicherte Erinnerung | souvenir enregistré |
| `stat.memories_other` | recuerdos guardados | memories saved | gespeicherte Erinnerungen | souvenirs enregistrés |
| `stat.moments_one` | momento vivido | moment lived | erlebter Moment | moment vécu |
| `stat.moments_other` | momentos vividos | moments lived | erlebte Momente | moments vécus |
| `title` | Resumen anual | Year in review | Jahresrückblick | Résumé de l'année |
| `topTag` | Lo que más guardaron: {{tag}} | What you saved the most: {{tag}} | Am häufigsten gespeichert: {{tag}} | Ce que vous avez le plus enregistré : {{tag}} |
| `yearSelect` | Año | Year | Jahr | Année |
