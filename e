[1mdiff --git a/scripts/apps/authoring/views/authoring-header.html b/scripts/apps/authoring/views/authoring-header.html[m
[1mindex 2e23f09..c04d63c 100644[m
[1m--- a/scripts/apps/authoring/views/authoring-header.html[m
[1m+++ b/scripts/apps/authoring/views/authoring-header.html[m
[36m@@ -232,7 +232,7 @@[m
              ng-if="schema.priority"[m
              sd-width="{{editor.priority.sdWidth}}"[m
              order="{{editor.priority.order}}">[m
[31m-            <label class="authoring-header__item-label" translate>PRIORITY</label>[m
[32m+[m[32m            <label class="authoring-header__item-label" translate>PRIORITY1</label>[m
             <div class="authoring-header__input-holder">[m
                 <div sd-meta-dropdown[m
                      data-item="item"[m
[36m@@ -255,7 +255,7 @@[m
              ng-if="schema.urgency && shouldDisplayUrgency()"[m
              sd-width="{{editor.urgency.sdWidth}}"[m
              order="{{editor.urgency.order}}">[m
[31m-            <label class="authoring-header__item-label" translate>URGENCY</label>[m
[32m+[m[32m            <label class="authoring-header__item-label" translate>URGENCY1</label>[m
             <div class="authoring-header__input-holder">[m
                 <div sd-meta-dropdown[m
                      data-item="item"[m
[36m@@ -334,6 +334,7 @@[m
             <label class="authoring-header__item-label">[m
                 <span>{{ cv.display_name | translate }}</span>[m
             </label>[m
[32m+[m[32m            {{cv._id}}[m
             <div class="authoring-header__input-holder">[m
                 <div sd-meta-terms[m
                     class="data"[m
