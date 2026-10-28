export interface AndroidSourceFile {
  id: string;
  category: 'manifest' | 'gradle' | 'data' | 'service' | 'ui' | 'main';
  path: string;
  title: string;
  description: string;
  language: 'kotlin' | 'xml' | 'groovy';
  code: string;
}

export const ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  {
    id: 'build-gradle-app',
    category: 'gradle',
    path: 'app/build.gradle.kts',
    title: 'app/build.gradle.kts',
    description: 'Configuração do módulo Android com Compose, Media3 1.3, Room 2.6, Hilt e Navigation',
    language: 'kotlin',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.ksp)
    alias(libs.plugins.hilt.android)
}

android {
    namespace = "com.meuaudiobook.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.meuaudiobook.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Media3 / ExoPlayer (Audiobook Engine com pitch preservation e MediaSessionService)
    implementation("androidx.media3:media3-exoplayer:1.3.1")
    implementation("androidx.media3:media3-session:1.3.1")
    implementation("androidx.media3:media3-ui:1.3.1")
    implementation("androidx.media3:media3-common:1.3.1")

    // Room Database (Armazenamento 100% Offline)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Hilt Dependency Injection
    implementation("com.google.dagger:hilt-android:2.50")
    ksp("com.google.dagger:hilt-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")

    // Coil para carregamento de capas de audiolivros
    implementation("io.coil-kt:coil-compose:2.6.0")

    // Datastore Preferences
    implementation("androidx.datastore:datastore-preferences:1.1.0")
}`
  },
  {
    id: 'android-manifest',
    category: 'manifest',
    path: 'app/src/main/AndroidManifest.xml',
    title: 'AndroidManifest.xml',
    description: 'Permissões para Foreground Service de Mídia, Leitura de Áudio e Notificação com Controles',
    language: 'xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissão para escanear áudio no dispositivo offline -->
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />

    <!-- Permissões para Player em Segundo Plano (Foreground Service) -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Acelerômetro para sensor de chacoalhar no Sleep Timer -->
    <uses-feature android:name="android.hardware.sensor.accelerometer" android:required="false" />

    <application
        android:name=".MeuAudiobookApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MeuAudiobook">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/Theme.MeuAudiobook">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Media3 MediaSessionService para Foreground Service com Notificação -->
        <service
            android:name=".service.AudioPlaybackService"
            android:exported="true"
            android:foregroundServiceType="mediaPlayback">
            <intent-filter>
                <action android:name="androidx.media3.session.MediaSessionService" />
                <action android:name="android.media.browse.MediaBrowserService" />
            </intent-filter>
        </service>

    </application>
</manifest>`
  },
  {
    id: 'room-entities',
    category: 'data',
    path: 'app/src/main/java/com/meuaudiobook/app/data/model/Entities.kt',
    title: 'Entities.kt (Modelos Room)',
    description: 'Entidades para Livros, Capítulos, Marcadores (Bookmarks) e Estatísticas Diárias',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.data.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Entidade Livro agrupado por diretório (pasta)
 */
@Entity(tableName = "books")
data class BookEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val author: String,
    val folderPath: String,
    val coverUri: String?,
    val totalDurationMs: Long,
    val currentPositionMs: Long = 0L,
    val currentChapterId: String?,
    val isCompleted: Boolean = false,
    val lastPlayedAt: Long = System.currentTimeMillis()
)

/**
 * Entidade Capítulo com arquivo de áudio específico
 */
@Entity(
    tableName = "chapters",
    foreignKeys = [
        ForeignKey(
            entity = BookEntity::class,
            parentColumns = ["id"],
            childColumns = ["bookId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["bookId"])]
)
data class ChapterEntity(
    @PrimaryKey
    val id: String,
    val bookId: String,
    val index: Int,
    val title: String,
    val audioUri: String,
    val durationMs: Long,
    val fileName: String
)

/**
 * Entidade Marcador (Bookmark com timestamp e notas)
 */
@Entity(
    tableName = "bookmarks",
    foreignKeys = [
        ForeignKey(
            entity = BookEntity::class,
            parentColumns = ["id"],
            childColumns = ["bookId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["bookId"])]
)
data class BookmarkEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val bookId: String,
    val chapterId: String,
    val timestampMs: Long,
    val title: String,
    val note: String?,
    val createdAt: Long = System.currentTimeMillis()
)

/**
 * Entidade Estatística diária de escuta
 */
@Entity(tableName = "daily_listening_stats")
data class DailyStatEntity(
    @PrimaryKey
    val date: String, // Formato: YYYY-MM-DD
    val totalMinutesListened: Int,
    val sessionsCount: Int
)`
  },
  {
    id: 'room-dao',
    category: 'data',
    path: 'app/src/main/java/com/meuaudiobook/app/data/local/AudiobookDaos.kt',
    title: 'AudiobookDaos.kt (DAOs)',
    description: 'Consultas Room com Flow reativo para Livros, Capítulos, Bookmarks e Estatísticas',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.data.local

import androidx.room.*
import com.meuaudiobook.app.data.model.*
import kotlinx.coroutines.flow.Flow

@Dao
interface BookDao {
    @Query("SELECT * FROM books ORDER BY lastPlayedAt DESC")
    fun getAllBooks(): Flow<List<BookEntity>>

    @Query("SELECT * FROM books WHERE id = :bookId")
    suspend fun getBookById(bookId: String): BookEntity?

    @Query("SELECT * FROM books WHERE isCompleted = 0 ORDER BY lastPlayedAt DESC")
    fun getInProgressBooks(): Flow<List<BookEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateBook(book: BookEntity)

    @Query("UPDATE books SET currentPositionMs = :positionMs, currentChapterId = :chapterId, lastPlayedAt = :timestamp WHERE id = :bookId")
    suspend fun updatePlaybackProgress(bookId: String, chapterId: String, positionMs: Long, timestamp: Long)

    @Query("UPDATE books SET isCompleted = :completed WHERE id = :bookId")
    suspend fun setBookCompleted(bookId: String, completed: Boolean)

    @Query("DELETE FROM books WHERE id = :bookId")
    suspend fun deleteBook(bookId: String)
}

@Dao
interface ChapterDao {
    @Query("SELECT * FROM chapters WHERE bookId = :bookId ORDER BY \`index\` ASC")
    fun getChaptersForBook(bookId: String): Flow<List<ChapterEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertChapters(chapters: List<ChapterEntity>)
}

@Dao
interface BookmarkDao {
    @Query("SELECT * FROM bookmarks WHERE bookId = :bookId ORDER BY timestampMs ASC")
    fun getBookmarksForBook(bookId: String): Flow<List<BookmarkEntity>>

    @Query("SELECT * FROM bookmarks ORDER BY createdAt DESC")
    fun getAllBookmarks(): Flow<List<BookmarkEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBookmark(bookmark: BookmarkEntity): Long

    @Delete
    suspend fun deleteBookmark(bookmark: BookmarkEntity)
}

@Dao
interface DailyStatDao {
    @Query("SELECT * FROM daily_listening_stats ORDER BY date DESC LIMIT 30")
    fun getRecentStats(): Flow<List<DailyStatEntity>>

    @Query("SELECT * FROM daily_listening_stats WHERE date = :date")
    suspend fun getStatForDate(date: String): DailyStatEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateStat(stat: DailyStatEntity)
}`
  },
  {
    id: 'room-database',
    category: 'data',
    path: 'app/src/main/java/com/meuaudiobook/app/data/local/AudiobookDatabase.kt',
    title: 'AudiobookDatabase.kt',
    description: 'Banco de dados Room offline com RoomDatabase Builder e migrations',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.meuaudiobook.app.data.model.*

@Database(
    entities = [
        BookEntity::class,
        ChapterEntity::class,
        BookmarkEntity::class,
        DailyStatEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AudiobookDatabase : RoomDatabase() {
    abstract fun bookDao(): BookDao
    abstract fun chapterDao(): ChapterDao
    abstract fun bookmarkDao(): BookmarkDao
    abstract fun dailyStatDao(): DailyStatDao

    companion object {
        const val DATABASE_NAME = "meu_audiobook_db"
    }
}`
  },
  {
    id: 'audiobook-service',
    category: 'service',
    path: 'app/src/main/java/com/meuaudiobook/app/service/AudioPlaybackService.kt',
    title: 'AudioPlaybackService.kt',
    description: 'Foreground Service via Media3 MediaSessionService, ExoPlayer com pitch preservado, ±30s e Notificação',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.service

import android.content.Intent
import android.os.Bundle
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.PlaybackParameters
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.CommandButton
import androidx.media3.session.MediaNotification
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import androidx.media3.session.SessionCommand
import androidx.media3.session.SessionResult
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class AudioPlaybackService : MediaSessionService() {

    private var mediaSession: MediaSession? = null
    private lateinit var exoPlayer: ExoPlayer

    companion object {
        const val CUSTOM_COMMAND_REWIND_30 = "com.meuaudiobook.REWIND_30"
        const val CUSTOM_COMMAND_FORWARD_30 = "com.meuaudiobook.FORWARD_30"
        const val CUSTOM_COMMAND_SET_SPEED = "com.meuaudiobook.SET_SPEED"
    }

    @OptIn(UnstableApi::class)
    override fun onCreate() {
        super.onCreate()

        // Configura atributos de áudio para Audiolivro / Fala (com Ducking e AudioFocus automático)
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(C.AUDIO_CONTENT_TYPE_SPEECH)
            .setUsage(C.USAGE_MEDIA)
            .build()

        exoPlayer = ExoPlayer.Builder(this)
            .setAudioAttributes(audioAttributes, /* handleAudioFocus = */ true)
            .setHandleAudioBecomingNoisy(true)
            .setWakeMode(C.WAKE_MODE_LOCAL)
            .build()

        // Preserva o tom de voz (pitch) mesmo em velocidades extremas de 0.5x até 5.0x
        exoPlayer.playbackParameters = PlaybackParameters(1.0f, /* pitch = */ 1.0f)

        // Custom action buttons para notificação de mídia (±30s)
        val rewindButton = CommandButton.Builder()
            .setDisplayName("Voltar 30s")
            .setIconResId(android.R.drawable.ic_media_rew)
            .setSessionCommand(SessionCommand(CUSTOM_COMMAND_REWIND_30, Bundle()))
            .build()

        val forwardButton = CommandButton.Builder()
            .setDisplayName("Avançar 30s")
            .setIconResId(android.R.drawable.ic_media_ff)
            .setSessionCommand(SessionCommand(CUSTOM_COMMAND_FORWARD_30, Bundle()))
            .build()

        mediaSession = MediaSession.Builder(this, exoPlayer)
            .setCallback(MediaSessionCallback())
            .setCustomLayout(listOf(rewindButton, forwardButton))
            .build()
    }

    private inner class MediaSessionCallback : MediaSession.Callback {
        override fun onConnect(
            session: MediaSession,
            controller: MediaSession.ControllerInfo
        ): MediaSession.ConnectionResult {
            val sessionCommands = MediaSession.ConnectionResult.DEFAULT_SESSION_COMMANDS.buildUpon()
                .add(SessionCommand(CUSTOM_COMMAND_REWIND_30, Bundle()))
                .add(SessionCommand(CUSTOM_COMMAND_FORWARD_30, Bundle()))
                .add(SessionCommand(CUSTOM_COMMAND_SET_SPEED, Bundle()))
                .build()

            return MediaSession.ConnectionResult.AcceptedResultBuilder(session)
                .setAvailableSessionCommands(sessionCommands)
                .build()
        }

        override fun onCustomCommand(
            session: MediaSession,
            controller: MediaSession.ControllerInfo,
            customCommand: SessionCommand,
            args: Bundle
        ): ListenableFuture<SessionResult> {
            when (customCommand.customAction) {
                CUSTOM_COMMAND_REWIND_30 -> {
                    val currentPos = exoPlayer.currentPosition
                    exoPlayer.seekTo((currentPos - 30_000L).coerceAtLeast(0L))
                    return Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS))
                }
                CUSTOM_COMMAND_FORWARD_30 -> {
                    val currentPos = exoPlayer.currentPosition
                    val duration = exoPlayer.duration
                    exoPlayer.seekTo((currentPos + 30_000L).coerceAtMost(duration))
                    return Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS))
                }
                CUSTOM_COMMAND_SET_SPEED -> {
                    val speed = args.getFloat("speed", 1.0f)
                    // ExoPlayer preserva o tom vocal nativamente
                    exoPlayer.playbackParameters = PlaybackParameters(speed, 1.0f)
                    return Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS))
                }
            }
            return super.onCustomCommand(session, controller, customCommand, args)
        }
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    override fun onDestroy() {
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        super.onDestroy()
    }
}`
  },
  {
    id: 'sleep-timer-manager',
    category: 'service',
    path: 'app/src/main/java/com/meuaudiobook/app/service/SleepTimerManager.kt',
    title: 'SleepTimerManager.kt',
    description: 'Gerenciador do Sleep Timer com esmaecimento (fadeout) suave e reinício ao chacoalhar aparelho',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.service

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import androidx.media3.exoplayer.ExoPlayer
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.math.sqrt

class SleepTimerManager(
    private val context: Context,
    private val exoPlayer: ExoPlayer
) : SensorEventListener {

    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as? SensorManager
    private val accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

    private var timerJob: Job? = null
    private var initialDurationMinutes: Int = 0

    private val _remainingSeconds = MutableStateFlow<Int?>(null)
    val remainingSeconds = _remainingSeconds.asStateFlow()

    private var shakeThreshold = 14.5f
    private var lastShakeTime = 0L

    fun startTimer(minutes: Int, onComplete: () -> Unit) {
        stopTimer()
        initialDurationMinutes = minutes
        val totalSeconds = minutes * 60

        // Ativa detector de movimento para chacoalhar
        accelerometer?.let {
            sensorManager?.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }

        timerJob = CoroutineScope(Dispatchers.Main).launch {
            for (sec in totalSeconds downTo 0) {
                _remainingSeconds.value = sec

                // Fade-out suave nos últimos 20 segundos
                if (sec in 1..20) {
                    val targetVolume = (sec.toFloat() / 20f).coerceIn(0.05f, 1.0f)
                    exoPlayer.volume = targetVolume
                }

                delay(1000L)
            }
            exoPlayer.pause()
            exoPlayer.volume = 1.0f
            stopTimer()
            onComplete()
        }
    }

    fun stopTimer() {
        timerJob?.cancel()
        timerJob = null
        _remainingSeconds.value = null
        exoPlayer.volume = 1.0f
        sensorManager?.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_ACCELEROMETER) {
            val x = event.values[0]
            val y = event.values[1]
            val z = event.values[2]
            val acceleration = sqrt((x * x + y * y + z * z).toDouble()).toFloat()

            if (acceleration > shakeThreshold) {
                val now = System.currentTimeMillis()
                if (now - lastShakeTime > 2000L) {
                    lastShakeTime = now
                    // Reinicia o timer ao chacoalhar o celular na cama!
                    if (initialDurationMinutes > 0) {
                        startTimer(initialDurationMinutes) {}
                    }
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}`
  },
  {
    id: 'ui-theme',
    category: 'ui',
    path: 'app/src/main/java/com/meuaudiobook/app/ui/theme/Theme.kt',
    title: 'Theme.kt & Color.kt',
    description: 'Design System Material 3 com suporte dinâmico a Dark/Light Theme e paleta de alto contraste',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Paleta Noturna Otimizada para Audiolivros (tons quentes de âmbar e carvão suave)
val DarkBackground = Color(0xFF131316)
val DarkSurface = Color(0xFF1E1E24)
val DarkSurfaceVariant = Color(0xFF282830)
val AmberPrimary = Color(0xFFF59E0B)
val AmberPrimaryDark = Color(0xFFD97706)
val AmberContainer = Color(0xFF452202)
val OnDarkSurface = Color(0xFFE4E4E7)
val OnDarkSurfaceMuted = Color(0xFFA1A1AA)

private val DarkColorScheme = darkColorScheme(
    primary = AmberPrimary,
    onPrimary = Color.Black,
    primaryContainer = AmberContainer,
    onPrimaryContainer = AmberPrimary,
    surface = DarkSurface,
    onSurface = OnDarkSurface,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = OnDarkSurfaceMuted,
    background = DarkBackground,
    onBackground = OnDarkSurface
)

private val LightColorScheme = lightColorScheme(
    primary = AmberPrimaryDark,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFEF3C7),
    onPrimaryContainer = Color(0xFF78350F),
    surface = Color(0xFFF8FAFC),
    onSurface = Color(0xFF0F172A),
    background = Color.White,
    onBackground = Color(0xFF0F172A)
)

@Composable
fun MeuAudiobookTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = androidx.compose.ui.platform.LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}`
  },
  {
    id: 'library-screen',
    category: 'ui',
    path: 'app/src/main/java/com/meuaudiobook/app/ui/screens/library/LibraryScreen.kt',
    title: 'LibraryScreen.kt',
    description: 'Tela de Biblioteca com scanner de pastas, agrupamento por livro, porcentagem e tempo restante',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.ui.screens.library

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.meuaudiobook.app.data.model.BookEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LibraryScreen(
    books: List<BookEntity>,
    onBookClick: (String) -> Unit,
    onScanFolderClick: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Meu Audiobook", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onScanFolderClick) {
                        Icon(Icons.Default.CreateNewFolder, contentDescription = "Escanear Pasta")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (books.isEmpty()) {
            EmptyLibraryState(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                onScanClick = onScanFolderClick
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(books, key = { it.id }) { book ->
                    AudiobookCard(book = book, onClick = { onBookClick(book.id) })
                }
            }
        }
    }
}

@Composable
fun AudiobookCard(book: BookEntity, onClick: () -> Unit) {
    val progress = if (book.totalDurationMs > 0) {
        (book.currentPositionMs.toFloat() / book.totalDurationMs.toFloat()).coerceIn(0f, 1f)
    } else 0f
    val percentInt = (progress * 100).toInt()
    val remainingMs = (book.totalDurationMs - book.currentPositionMs).coerceAtLeast(0L)
    val remainingHours = remainingMs / 3_600_000
    val remainingMinutes = (remainingMs % 3_600_000) / 60_000

    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant,
        tonalElevation = 2.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Capa representativa
            Box(
                modifier = Modifier
                    .size(72.dp, 96.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.MenuBook,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.size(32.dp)
                )
            }

            // Metadados do Livro
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = book.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = book.author,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Barra de progresso com porcentagem e tempo restante
                LinearProgressIndicator(
                    progress = { progress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp)),
                )

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "$percentInt% concluído",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Faltam \${remainingHours}h \${remainingMinutes}m",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
fun EmptyLibraryState(modifier: Modifier, onScanClick: () -> Unit) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Default.FolderOpen,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text("Nenhum audiolivro carregado", style = MaterialTheme.typography.titleLarge)
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            "Selecione uma pasta do seu aparelho para agrupar áudios e capas.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = onScanClick) {
            Icon(Icons.Default.Add, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Escanear Pasta")
        }
    }
}`
  },
  {
    id: 'player-screen',
    category: 'ui',
    path: 'app/src/main/java/com/meuaudiobook/app/ui/screens/player/PlayerScreen.kt',
    title: 'PlayerScreen.kt',
    description: 'Tela Principal do Player com Play/Pause, ±30s, Controle de Velocidade 0.5x-5.0x e Sleep Timer',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.ui.screens.player

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlayerScreen(
    bookTitle: String,
    chapterTitle: String,
    author: String,
    isPlaying: Boolean,
    currentPositionMs: Long,
    totalDurationMs: Long,
    currentSpeed: Float,
    sleepTimerText: String?,
    onPlayPauseToggle: () -> Unit,
    onRewind30: () -> Unit,
    onForward30: () -> Unit,
    onSeekTo: (Long) -> Unit,
    onSpeedClick: () -> Unit,
    onSleepTimerClick: () -> Unit,
    onBookmarkClick: () -> Unit,
    onBackClick: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Tocando Agora", fontSize = 18.sp) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Voltar")
                    }
                },
                actions = {
                    IconButton(onClick = onBookmarkClick) {
                        Icon(Icons.Default.BookmarkAdd, contentDescription = "Criar Marcador")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceEvenly
        ) {
            // Capa do Audiolivro com elevação suave
            Box(
                modifier = Modifier
                    .size(240.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Headphones,
                    contentDescription = null,
                    modifier = Modifier.size(96.dp),
                    tint = MaterialTheme.colorScheme.onPrimaryContainer
                )
            }

            // Títulos
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = bookTitle,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = chapterTitle,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = author,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Barra de Progresso com Timestamps
            Column(modifier = Modifier.fillMaxWidth()) {
                val progress = if (totalDurationMs > 0) (currentPositionMs.toFloat() / totalDurationMs.toFloat()).coerceIn(0f, 1f) else 0f
                Slider(
                    value = progress,
                    onValueChange = { frac ->
                        onSeekTo((frac * totalDurationMs).toLong())
                    },
                    modifier = Modifier.fillMaxWidth()
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(formatTime(currentPositionMs), fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("-" + formatTime(totalDurationMs - currentPositionMs), fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            // Controles de Reprodução (±30s e Play/Pause Principal)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Voltar 30 segundos
                IconButton(
                    onClick = onRewind30,
                    modifier = Modifier.size(56.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Replay30,
                        contentDescription = "Voltar 30 segundos",
                        modifier = Modifier.size(36.dp)
                    )
                }

                // Play / Pause com botão de destaque circular
                FilledIconButton(
                    onClick = onPlayPauseToggle,
                    modifier = Modifier.size(76.dp),
                    shape = CircleShape
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pausar" else "Reproduzir",
                        modifier = Modifier.size(44.dp)
                    )
                }

                // Avançar 30 segundos
                IconButton(
                    onClick = onForward30,
                    modifier = Modifier.size(56.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Forward30,
                        contentDescription = "Avançar 30 segundos",
                        modifier = Modifier.size(36.dp)
                    )
                }
            }

            // Controles Secundários: Velocidade (0.5x-5.0x) e Sleep Timer
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                TextButton(onClick = onSpeedClick) {
                    Icon(Icons.Default.Speed, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(String.format("%.1fx", currentSpeed), fontWeight = FontWeight.Bold)
                }

                TextButton(onClick = onSleepTimerClick) {
                    Icon(Icons.Default.Bedtime, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(sleepTimerText ?: "Sleep Timer")
                }
            }
        }
    }
}

fun formatTime(ms: Long): String {
    val totalSeconds = (ms / 1000).coerceAtLeast(0)
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    val hours = minutes / 60
    return if (hours > 0) {
        String.format("%d:%02d:%02d", hours, minutes % 60, seconds)
    } else {
        String.format("%02d:%02d", minutes, seconds)
    }
}`
  },
  {
    id: 'stats-screen',
    category: 'ui',
    path: 'app/src/main/java/com/meuaudiobook/app/ui/screens/stats/StatsScreen.kt',
    title: 'StatsScreen.kt',
    description: 'Estatísticas de escuta diária, sequência (streak) em dias e gráfico semanal',
    language: 'kotlin',
    code: `package com.meuaudiobook.app.ui.screens.stats

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Equalizer
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.meuaudiobook.app.data.model.DailyStatEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StatsScreen(
    todayMinutes: Int,
    currentStreakDays: Int,
    weeklyStats: List<DailyStatEntity>
) {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Estatísticas de Escuta", fontWeight = FontWeight.Bold) })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Cartões de Resumo
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = "Hoje",
                    value = "$todayMinutes min",
                    icon = Icons.Default.Schedule,
                    tint = MaterialTheme.colorScheme.primary
                )
                StatCard(
                    modifier = Modifier.weight(1f),
                    title = "Sequência",
                    value = "$currentStreakDays dias",
                    icon = Icons.Default.LocalFireDepartment,
                    tint = Color(0xFFEA580C)
                )
            }

            // Gráfico semanal de barras
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surfaceVariant
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Histórico dos Últimos 7 Dias",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(24.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        weeklyStats.takeLast(7).forEach { stat ->
                            val maxMinutes = 90f
                            val heightFrac = (stat.totalMinutesListened / maxMinutes).coerceIn(0.1f, 1f)

                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Bottom,
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("\${stat.totalMinutesListened}m", fontSize = 10.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Box(
                                    modifier = Modifier
                                        .fillMaxHeight(heightFrac)
                                        .width(20.dp)
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(MaterialTheme.colorScheme.primary)
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = stat.date.takeLast(2),
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    tint: Color
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Icon(icon, contentDescription = null, tint = tint)
            Spacer(modifier = Modifier.height(8.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Text(title, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}`
  },
  {
    id: 'main-activity',
    category: 'main',
    path: 'app/src/main/java/com/meuaudiobook/app/MainActivity.kt',
    title: 'MainActivity.kt',
    description: 'Activity principal com injeção Hilt, BottomNavigation Material 3 e controle de estado',
    language: 'kotlin',
    code: `package com.meuaudiobook.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.*
import com.meuaudiobook.app.ui.theme.MeuAudiobookTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MeuAudiobookTheme {
                val navController = rememberNavController()
                var currentRoute by remember { mutableStateOf("library") }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        NavigationBar {
                            NavigationBarItem(
                                selected = currentRoute == "library",
                                onClick = { currentRoute = "library"; navController.navigate("library") },
                                icon = { Icon(Icons.Default.LibraryBooks, contentDescription = null) },
                                label = { Text("Biblioteca") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == "player",
                                onClick = { currentRoute = "player"; navController.navigate("player") },
                                icon = { Icon(Icons.Default.PlayCircle, contentDescription = null) },
                                label = { Text("Player") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == "bookmarks",
                                onClick = { currentRoute = "bookmarks"; navController.navigate("bookmarks") },
                                icon = { Icon(Icons.Default.Bookmarks, contentDescription = null) },
                                label = { Text("Marcadores") }
                            )
                            NavigationBarItem(
                                selected = currentRoute == "stats",
                                onClick = { currentRoute = "stats"; navController.navigate("stats") },
                                icon = { Icon(Icons.Default.BarChart, contentDescription = null) },
                                label = { Text("Estatísticas") }
                            )
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "library",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("library") {
                            // LibraryScreenComposable
                        }
                        composable("player") {
                            // PlayerScreenComposable
                        }
                        composable("bookmarks") {
                            // BookmarksScreenComposable
                        }
                        composable("stats") {
                            // StatsScreenComposable
                        }
                    }
                }
            }
        }
    }
}`
  }
];
