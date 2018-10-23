@echo off

if not x%1==x goto %1

:help
:-h
:--help
echo Check the state of the port.
echo.
echo psec -n
echo psec -m
echo psec -nmap
echo -^> Check the state of the port of the local host.
echo    ("nmap" is required)
echo.
echo psec -p ^<port^>
echo psec -port ^<port^>
echo -^> Check current network status.
echo.
echo psec -t ^<pid^>
echo psec --task ^<pid^>
echo -^> Search processes matching process ID.
goto eof

:-n
:-m
:--nmap
echo PORT      STATE SERVICE
echo ========= ===== ==================
nmap localhost | find "tcp"
goto eof

:-p
:--port
echo PROT    LOCAL                  OUTSIDE                STATUS          PID
echo ======= ====================== ====================== =============== =====
netstat -ano | find ":%2 "
goto eof

:-t
:--task
echo IMAGE-NAME                PID      SESSION-NAME     SESSION #   MEMORY
echo ========================= ======== ================ =========== ============
tasklist | find " %2 "
goto eof

:eof
