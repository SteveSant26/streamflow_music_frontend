'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">b documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/ArtistComponent.html" data-type="entity-link" >ArtistComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AsideMenu.html" data-type="entity-link" >AsideMenu</a>
                            </li>
                            <li class="link">
                                <a href="components/Card.html" data-type="entity-link" >Card</a>
                            </li>
                            <li class="link">
                                <a href="components/CardPlayButton.html" data-type="entity-link" >CardPlayButton</a>
                            </li>
                            <li class="link">
                                <a href="components/ConnectionTestComponent.html" data-type="entity-link" >ConnectionTestComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CurrentSongComponent.html" data-type="entity-link" >CurrentSongComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExploreComponent.html" data-type="entity-link" >ExploreComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Greeting.html" data-type="entity-link" >Greeting</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LibraryComponent.html" data-type="entity-link" >LibraryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MusicsTable.html" data-type="entity-link" >MusicsTable</a>
                            </li>
                            <li class="link">
                                <a href="components/MusicsTablePlay.html" data-type="entity-link" >MusicsTablePlay</a>
                            </li>
                            <li class="link">
                                <a href="components/Player.html" data-type="entity-link" >Player</a>
                            </li>
                            <li class="link">
                                <a href="components/PlayerControlButtonBar.html" data-type="entity-link" >PlayerControlButtonBar</a>
                            </li>
                            <li class="link">
                                <a href="components/PlayerCurrentSong.html" data-type="entity-link" >PlayerCurrentSong</a>
                            </li>
                            <li class="link">
                                <a href="components/PlayerSoundControl.html" data-type="entity-link" >PlayerSoundControl</a>
                            </li>
                            <li class="link">
                                <a href="components/PlayerVolumeControl.html" data-type="entity-link" >PlayerVolumeControl</a>
                            </li>
                            <li class="link">
                                <a href="components/PlaylistComponent.html" data-type="entity-link" >PlaylistComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PlayListItemCard.html" data-type="entity-link" >PlayListItemCard</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchComponent.html" data-type="entity-link" >SearchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SideMenuCard.html" data-type="entity-link" >SideMenuCard</a>
                            </li>
                            <li class="link">
                                <a href="components/SideMenuItem.html" data-type="entity-link" >SideMenuItem</a>
                            </li>
                            <li class="link">
                                <a href="components/UserPerfilComponent.html" data-type="entity-link" >UserPerfilComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthError.html" data-type="entity-link" >AuthError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthRepository.html" data-type="entity-link" >AuthRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/IAuthRepository.html" data-type="entity-link" >IAuthRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/IAuthService.html" data-type="entity-link" >IAuthService</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginError.html" data-type="entity-link" >LoginError</a>
                            </li>
                            <li class="link">
                                <a href="classes/NetworkError.html" data-type="entity-link" >NetworkError</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterError.html" data-type="entity-link" >RegisterError</a>
                            </li>
                            <li class="link">
                                <a href="classes/SessionError.html" data-type="entity-link" >SessionError</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationError.html" data-type="entity-link" >ValidationError</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiService-1.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ArtistService.html" data-type="entity-link" >ArtistService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthRepositoryImpl.html" data-type="entity-link" >AuthRepositoryImpl</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService-1.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthSessionUseCase.html" data-type="entity-link" >AuthSessionUseCase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthStateService.html" data-type="entity-link" >AuthStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CheckAuthUseCase.html" data-type="entity-link" >CheckAuthUseCase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginUseCase.html" data-type="entity-link" >LoginUseCase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogoutUseCase.html" data-type="entity-link" >LogoutUseCase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlaylistService.html" data-type="entity-link" >PlaylistService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegisterUseCase.html" data-type="entity-link" >RegisterUseCase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResetPasswordUseCase.html" data-type="entity-link" >ResetPasswordUseCase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link" >SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SocialLoginUseCase.html" data-type="entity-link" >SocialLoginUseCase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SongService.html" data-type="entity-link" >SongService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SupabaseAuthRepository.html" data-type="entity-link" >SupabaseAuthRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SupabaseService.html" data-type="entity-link" >SupabaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TestConnectionService.html" data-type="entity-link" >TestConnectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenStorageService.html" data-type="entity-link" >TokenStorageService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthTokenInterceptor.html" data-type="entity-link" >AuthTokenInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/HttpErrorInterceptor.html" data-type="entity-link" >HttpErrorInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AddSongToPlaylistDto.html" data-type="entity-link" >AddSongToPlaylistDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Album.html" data-type="entity-link" >Album</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Album-1.html" data-type="entity-link" >Album</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Album-2.html" data-type="entity-link" >Album</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponse.html" data-type="entity-link" >ApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Artist.html" data-type="entity-link" >Artist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Artist-1.html" data-type="entity-link" >Artist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Artist-2.html" data-type="entity-link" >Artist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthResponse.html" data-type="entity-link" >AuthResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthResult.html" data-type="entity-link" >AuthResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthResult-1.html" data-type="entity-link" >AuthResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthSession.html" data-type="entity-link" >AuthSession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthToken.html" data-type="entity-link" >AuthToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Award.html" data-type="entity-link" >Award</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreatePlaylistDto.html" data-type="entity-link" >CreatePlaylistDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrentMusic.html" data-type="entity-link" >CurrentMusic</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrentMusic-1.html" data-type="entity-link" >CurrentMusic</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginCredentials.html" data-type="entity-link" >LoginCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginCredentials-1.html" data-type="entity-link" >LoginCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginRequestDTO.html" data-type="entity-link" >LoginRequestDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginatedResponse.html" data-type="entity-link" >PaginatedResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Playlist.html" data-type="entity-link" >Playlist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Playlist-1.html" data-type="entity-link" >Playlist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Playlist-2.html" data-type="entity-link" >Playlist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Playlist-3.html" data-type="entity-link" >Playlist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Playlist-4.html" data-type="entity-link" >Playlist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Playlist-5.html" data-type="entity-link" >Playlist</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PlaylistFilters.html" data-type="entity-link" >PlaylistFilters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PlaylistSong.html" data-type="entity-link" >PlaylistSong</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterCredentials.html" data-type="entity-link" >RegisterCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterCredentials-1.html" data-type="entity-link" >RegisterCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterRequestDTO.html" data-type="entity-link" >RegisterRequestDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchFilters.html" data-type="entity-link" >SearchFilters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchResults.html" data-type="entity-link" >SearchResults</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Song.html" data-type="entity-link" >Song</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Song-1.html" data-type="entity-link" >Song</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Song-2.html" data-type="entity-link" >Song</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Song-3.html" data-type="entity-link" >Song</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Song-4.html" data-type="entity-link" >Song</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Song-5.html" data-type="entity-link" >Song</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Song-6.html" data-type="entity-link" >Song</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdatePlaylistDto.html" data-type="entity-link" >UpdatePlaylistDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User-1.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserDTO.html" data-type="entity-link" >UserDTO</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});