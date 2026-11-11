import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Share,
  Switch,
  Alert,
} from 'react-native';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  location: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'INICIO' | 'NOTICIAS' | 'CHAT' | 'PERFIL'>('INICIO');
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null);

  // Liquidador State
  const [kilos, setKilos] = useState('1250');
  const [factor, setFactor] = useState('94');
  const [precioBaseCarga, setPrecioBaseCarga] = useState('2100000');
  const [pasillaKilos, setPasillaKilos] = useState('0');
  const [pasillaPrecioKilo, setPasillaPrecioKilo] = useState('5600');

  // Preferencias State
  const [notifDaily, setNotifDaily] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Don Hernando Méndez',
      location: 'Pitalito, Huila',
      text: 'Buenos días compañeros cafeteros. ¿Cómo les liquidaron hoy la carga en la cooperativa? A mí me reconocieron factor 91 a buen precio.',
      timestamp: '07:05 AM',
    },
    {
      id: '2',
      sender: 'Doña Rosaura Gómez',
      location: 'Fredonia, Antioquia',
      text: 'Por acá en Antioquia amaneció soleado para secar en paseras. El café seco lo están recibiendo a los $2.100.000 oficiales.',
      timestamp: '07:12 AM',
    },
    {
      id: '3',
      sender: 'Carlos Alirio Duarte',
      location: 'Chinchiná, Caldas',
      text: 'Recuerden calibrar bien la humedad entre el 10% y el 12% para que no les castiguen peso en la compra.',
      timestamp: '07:14 AM',
    },
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Noticias State
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const newsData: NewsItem[] = [
    {
      id: '1',
      title: 'Federación Nacional de Cafeteros publica precio base interno para carga de 125 kg',
      summary: 'El Comité Directivo de la FNC fijó la cotización de referencia en $2.100.000 para café pergamino seco con factor de rendimiento 94.',
      source: 'Boletín Oficial FNC',
      date: 'Hoy, 06:30 AM',
      category: 'FNC',
    },
    {
      id: '2',
      title: 'Mercado internacional: Inventarios de café arábica en puertos de NY y Europa',
      summary: 'La prima por calidad del café suave colombiano se mantiene sólida en los mercados de futuros a pesar de la volatilidad del dólar.',
      source: 'Bolsa de Nueva York (ICE)',
      date: 'Ayer, 05:45 PM',
      category: 'Mercado',
    },
    {
      id: '3',
      title: 'Pronóstico de cosecha principal en Huila, Nariño y Antioquia',
      summary: 'El IDEAM prevé clima favorable para las labores de recolección y secado al sol en las zonas cafeteras del sur y centro del país.',
      source: 'Cenicafé / IDEAM',
      date: 'Ayer, 02:15 PM',
      category: 'Clima',
    },
    {
      id: '4',
      title: 'Recomendaciones para mantener el factor de rendimiento por debajo de 90',
      summary: 'Cenicafé comparte técnicas clave de beneficio ecológico, clasificación por densidad y secado uniforme para maximizar el valor de la carga.',
      source: 'Extensión Rural FNC',
      date: 'Hace 2 días',
      category: 'Cosecha',
    },
  ];

  // Cálculo de liquidación oficial FNC
  const getLiquidation = () => {
    const k = parseFloat(kilos) || 0;
    const f = parseFloat(factor) || 94;
    const baseCarga = parseFloat(precioBaseCarga) || 2100000;
    const baseKilo = baseCarga / 125;
    const precioAjustadoKilo = Math.round(baseKilo * (94 / f));
    const precioAjustadoCarga = Math.round(precioAjustadoKilo * 125);
    const subtotalCafe = Math.round(k * precioAjustadoKilo);
    const pk = parseFloat(pasillaKilos) || 0;
    const pp = parseFloat(pasillaPrecioKilo) || 5600;
    const subtotalPasilla = Math.round(pk * pp);
    const total = subtotalCafe + subtotalPasilla;
    return {
      precioAjustadoKilo,
      precioAjustadoCarga,
      subtotalCafe,
      subtotalPasilla,
      total,
    };
  };

  const handleShareReceipt = async () => {
    const liq = getLiquidation();
    const receipt = `☕ LIQUIDACIÓN CAFÉFSEP
--------------------------
Kilos Pergamino: ${kilos} kg
Factor Rendimiento: ${factor}
Precio / Kilo: $ ${liq.precioAjustadoKilo.toLocaleString('es-CO')}
Precio / Carga (125 kg): $ ${liq.precioAjustadoCarga.toLocaleString('es-CO')}
Subtotal Café: $ ${liq.subtotalCafe.toLocaleString('es-CO')}
${pasillaKilos !== '0' ? `Subtotal Pasilla: $ ${liq.subtotalPasilla.toLocaleString('es-CO')}\n` : ''}--------------------------
TOTAL A RECIBIR: $ ${liq.total.toLocaleString('es-CO')}
--------------------------
Cotizado en CAFÉFSEP Móvil`;

    try {
      await Share.share({ message: receipt });
    } catch (e) {
      console.log(e);
    }
  };

  const handleShareQuotation = async () => {
    try {
      await Share.share({
        message: '☕ CAFÉFSEP - Precios de Hoy:\n• Café Seco: $ 2.100.000\n• Café Verde: $ 9.000\n• Pasilla: $ 600\n• Futuros NY Coffee C (KCZ6): 273,05 (-2,48%)\nEl mercado y cotizaciones del café en vivo.',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSendMessage = () => {
    if (!newChatText.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Mi Usuario (Caficultor)',
      location: 'Huila, Colombia',
      text: newChatText.trim(),
      timestamp: 'Ahora',
      isUser: true,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setNewChatText('');

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Guillermo Restrepo',
        location: 'Sevilla, Valle',
        text: '¡Compañero! Totalmente de acuerdo, estamos atentos a la apertura de mercado mañana temprano.',
        timestamp: 'Ahora',
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const liqResult = getLiquidation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#a80808" />

      {/* Encabezado Rojo Intenso CAFÉFSEP */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.liveBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.updateText}>Actualizado: Hoy, 07:15 AM</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.liquidatorBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.liquidatorBtnText}>Liquidador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Actualizado', 'Cotizaciones en vivo sincronizadas con éxito.')}>
              <Text style={styles.iconBtnText}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShareQuotation}>
              <Text style={styles.iconBtnText}>🔗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logotipo Central */}
        <View style={styles.brandRow}>
          <Text style={styles.brandEmoji}>☕</Text>
          <View style={styles.chartBars}>
            <View style={[styles.bar, { height: 10 }]} />
            <View style={[styles.bar, { height: 16 }]} />
            <View style={[styles.bar, { height: 22 }]} />
            <Text style={styles.chartArrow}>▲</Text>
          </View>
          <Text style={styles.brandTitle}>CAFÉFSEP</Text>
          <Text style={styles.brandEmoji}>☕</Text>
        </View>
        <Text style={styles.brandTagline}>EL MERCADO Y COTIZACIONES DEL CAFÉ EN VIVO</Text>
        <View style={styles.goldLine} />
      </View>

      {/* PANTALLA: INICIO */}
      {currentTab === 'INICIO' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Tarjeta Café Seco */}
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>CAFE SECO</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.mainPrice}>$ 2.100.000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
              <Text style={styles.variationText}>Bajo $ 35.000</Text>
              <View style={styles.subPriceBox}>
                <Text style={styles.subPriceLabel}>Precio por medio Kilo</Text>
                <Text style={styles.subPriceValue}>$ 16.040</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Tarjeta Café Verde */}
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>CAFE VERDE</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.mainPrice}>$ 9.000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooterCenter}>
              <Text style={styles.variationText}>Bajo $ 9.500</Text>
            </View>
          </TouchableOpacity>

          {/* Tarjeta Pasilla */}
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>PASILLA</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.mainPrice}>$ 600</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
              <Text style={styles.variationText}>Bajo $ 700</Text>
              <View style={styles.subPriceBox}>
                <Text style={styles.subPriceLabel}>Por medio Kilo</Text>
                <Text style={styles.subPriceValue}>$ 5.600</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Cotización Internacional Futuros Coffee C */}
          <View style={styles.futuresCard}>
            <View style={styles.futuresTop}>
              <Text style={styles.futuresTitle}>Futuros café C EE.UU. - Dic 2026 (KCZ6)</Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                <Text style={styles.infoIcon}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.futuresRow}>
              <Text style={styles.futuresValue}>273,05</Text>
              <Text style={styles.futuresChange}>-6,95 (-2,48%) ▼</Text>
            </View>
            <Text style={styles.marketStatus}>🕒 Mercado cerrado · 06:11:52</Text>
          </View>

          {/* Botón Herramienta para Caficultores */}
          <TouchableOpacity style={styles.toolBtn} activeOpacity={0.85} onPress={() => setModalVisible(true)}>
            <View style={styles.toolLeft}>
              <View style={styles.calcIconBox}>
                <Text style={styles.calcIconText}>🧮</Text>
              </View>
              <View>
                <Text style={styles.toolSub}>HERRAMIENTA PARA CAFICULTORES</Text>
                <Text style={styles.toolMain}>Liquidar mi Café (Kilos y Factor)</Text>
              </View>
            </View>
            <Text style={styles.toolArrow}>❯</Text>
          </TouchableOpacity>

          {/* Banner Calidad y Tradición */}
          <View style={styles.traditionCard}>
            <View style={styles.traditionBadge}>
              <Text style={styles.traditionGold}>CALIDAD Y TRADICIÓN</Text>
              <Text style={styles.traditionWhite}>Cotizaciones de referencia para el caficultor colombiano</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* PANTALLA: NOTICIAS */}
      {currentTab === 'NOTICIAS' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {['Todos', 'FNC', 'Mercado', 'Cosecha', 'Clima'].map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.catChip, selectedCategory === c && styles.catChipActive]}
                onPress={() => setSelectedCategory(c)}
              >
                <Text style={[styles.catChipText, selectedCategory === c && styles.catChipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {newsData
            .filter((n) => selectedCategory === 'Todos' || n.category === selectedCategory)
            .map((news) => (
              <TouchableOpacity
                key={news.id}
                style={styles.newsCard}
                activeOpacity={0.8}
                onPress={() => setActiveNews(news)}
              >
                <View style={styles.newsHeader}>
                  <Text style={styles.newsCatBadge}>{news.category}</Text>
                  <Text style={styles.newsDate}>{news.date}</Text>
                </View>
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsSummary}>{news.summary}</Text>
                <View style={styles.newsFooter}>
                  <Text style={styles.newsSource}>{news.source}</Text>
                  <Text style={styles.newsReadMore}>Leer nota →</Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}

      {/* PANTALLA: CHAT */}
      {currentTab === 'CHAT' && (
        <View style={styles.chatContainer}>
          <View style={styles.chatBanner}>
            <Text style={styles.chatBannerTitle}>👥 Comunidad Caficultores Colombia (En Vivo)</Text>
            <Text style={styles.chatBannerStatus}>● 142 activos</Text>
          </View>

          <ScrollView style={styles.chatList} contentContainerStyle={{ padding: 12 }}>
            {chatMessages.map((m) => (
              <View key={m.id} style={[styles.chatBubbleContainer, m.isUser && styles.chatBubbleRight]}>
                <View style={styles.chatMeta}>
                  <Text style={styles.chatSender}>{m.sender}</Text>
                  <Text style={styles.chatLocation}>📍 {m.location}</Text>
                </View>
                <View style={[styles.chatBubble, m.isUser ? styles.chatBubbleUser : styles.chatBubbleOther]}>
                  <Text style={[styles.chatBubbleText, m.isUser && styles.chatBubbleTextUser]}>{m.text}</Text>
                  <Text style={[styles.chatBubbleTime, m.isUser && styles.chatBubbleTimeUser]}>{m.timestamp}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Escribe a los caficultores..."
              value={newChatText}
              onChangeText={setNewChatText}
            />
            <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendMessage}>
              <Text style={styles.chatSendBtnText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PANTALLA: PERFIL */}
      {currentTab === 'PERFIL' && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>CF</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.profileName}>Caficultor Registrado</Text>
                <Text style={styles.profileFinca}>📍 Finca La Esperanza · Pitalito, Huila</Text>
                <Text style={styles.profileVariety}>Café Arábica · Variedad Castillo</Text>
              </View>
            </View>

            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatItem}>
                <Text style={styles.statLabel}>Altitud</Text>
                <Text style={styles.statVal}>1.740 m</Text>
              </View>
              <View style={styles.profileStatItem}>
                <Text style={styles.statLabel}>Área</Text>
                <Text style={styles.statVal}>4.2 Ha</Text>
              </View>
              <View style={styles.profileStatItem}>
                <Text style={styles.statLabel}>Factor Prom.</Text>
                <Text style={[styles.statVal, { color: '#c80000' }]}>91.5</Text>
              </View>
            </View>
          </View>

          <View style={styles.apkCard}>
            <View style={styles.apkTop}>
              <Text style={styles.apkTitle}>📱 Preparado para APK Android</Text>
              <Text style={styles.apkTag}>Expo Ready</Text>
            </View>
            <Text style={styles.apkDesc}>
              Este proyecto contiene todo el código nativo de React Native con Expo listo para compilar un instalador .APK o instalarse directamente en tu Android.
            </Text>
            <TouchableOpacity
              style={styles.apkBtn}
              onPress={() => Alert.alert('Comando para compilar APK', 'Ejecuta en tu terminal:\neas build -p android --profile preview')}
            >
              <Text style={styles.apkBtnText}>Ver Comando de Compilación APK</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.prefCard}>
            <Text style={styles.prefTitle}>⚙️ Preferencias</Text>
            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefLabel}>Alertas de Cotización Diaria</Text>
                <Text style={styles.prefSub}>Notificar precio a las 7:15 AM</Text>
              </View>
              <Switch value={notifDaily} onValueChange={setNotifDaily} trackColor={{ false: '#ccc', true: '#c80000' }} />
            </View>

            <View style={styles.prefRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prefLabel}>Sonido de Campana Cafetera</Text>
                <Text style={styles.prefSub}>Alerta al actualizar bolsa de NY</Text>
              </View>
              <Switch value={soundAlerts} onValueChange={setSoundAlerts} trackColor={{ false: '#ccc', true: '#c80000' }} />
            </View>
          </View>
        </ScrollView>
      )}

      {/* Menú Inferior Rojo con 4 Opciones */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('INICIO')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, currentTab === 'INICIO' && styles.navActiveText]}>INICIO</Text>
        </TouchableOpacity>
        <View style={styles.navDivider} />
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('NOTICIAS')}>
          <Text style={styles.navIcon}>📰</Text>
          <Text style={[styles.navText, currentTab === 'NOTICIAS' && styles.navActiveText]}>NOTICIAS</Text>
        </TouchableOpacity>
        <View style={styles.navDivider} />
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('CHAT')}>
          <View style={{ position: 'relative' }}>
            <Text style={styles.navIcon}>💬</Text>
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>2</Text>
            </View>
          </View>
          <Text style={[styles.navText, currentTab === 'CHAT' && styles.navActiveText]}>CHAT</Text>
        </TouchableOpacity>
        <View style={styles.navDivider} />
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentTab('PERFIL')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navText, currentTab === 'PERFIL' && styles.navActiveText]}>PERFIL</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Liquidador de Café */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🧮 Liquidador de Café</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 450 }}>
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  En Colombia, 1 Carga = 125 kg. El factor base oficial es 94. A menor factor, mayor es el precio liquidado.
                </Text>
              </View>

              <Text style={styles.inputLabel}>Kilos de Pergamino Seco (kg):</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={kilos} onChangeText={setKilos} />

              <View style={styles.presetRow}>
                {['125', '625', '1250', '2500'].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.presetChip, kilos === val && styles.presetChipActive]}
                    onPress={() => setKilos(val)}
                  >
                    <Text style={[styles.presetText, kilos === val && styles.presetTextActive]}>
                      {val === '125' ? '1 Carga' : `${parseInt(val) / 125} Cargas`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Factor de Rendimiento (Base 94):</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={factor} onChangeText={setFactor} />

              <Text style={styles.inputLabel}>Precio Base Carga (125 kg):</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={precioBaseCarga} onChangeText={setPrecioBaseCarga} />

              <View style={styles.resultBox}>
                <Text style={styles.resultHeader}>RESULTADO DE LIQUIDACIÓN</Text>
                <Text style={styles.resultTotalLabel}>TOTAL A RECIBIR:</Text>
                <Text style={styles.resultTotalVal}>$ {liqResult.total.toLocaleString('es-CO')}</Text>

                <View style={styles.resultRow}>
                  <Text style={styles.resultKey}>Precio / Kilo:</Text>
                  <Text style={styles.resultVal}>$ {liqResult.precioAjustadoKilo.toLocaleString('es-CO')}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultKey}>Precio / Carga:</Text>
                  <Text style={styles.resultVal}>$ {liqResult.precioAjustadoCarga.toLocaleString('es-CO')}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultKey}>Subtotal Café:</Text>
                  <Text style={styles.resultVal}>$ {liqResult.subtotalCafe.toLocaleString('es-CO')}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.shareReceiptBtn} onPress={handleShareReceipt}>
                <Text style={styles.shareReceiptText}>📤 Compartir Recibo por WhatsApp</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Información Futuros */}
      <Modal visible={infoModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.infoModalCard}>
            <Text style={styles.infoModalTitle}>¿Qué es el Contrato Coffee "C"?</Text>
            <Text style={styles.infoModalDesc}>
              El contrato Coffee "C" en el Intercontinental Exchange (ICE) de Nueva York es el precio de referencia mundial para el café Arábica lavado, como el de Colombia.
              {'\n\n'}
              El código KCZ6 significa:
              {'\n'}• KC: Coffee "C"
              {'\n'}• Z: Entrega en Diciembre
              {'\n'}• 6: Año 2026
            </Text>
            <TouchableOpacity style={styles.infoModalBtn} onPress={() => setInfoModalVisible(false)}>
              <Text style={styles.infoModalBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Detalle Noticia */}
      <Modal visible={activeNews !== null} animationType="fade" transparent>
        <View style={styles.modalOverlayCenter}>
          <View style={styles.infoModalCard}>
            <Text style={styles.infoModalTitle}>{activeNews?.title}</Text>
            <Text style={styles.newsDate}>{activeNews?.source} · {activeNews?.date}</Text>
            <Text style={styles.infoModalDesc}>{activeNews?.summary}</Text>
            <TouchableOpacity style={styles.infoModalBtn} onPress={() => setActiveNews(null)}>
              <Text style={styles.infoModalBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { backgroundColor: '#b70c0c', paddingTop: 8, paddingBottom: 12, paddingHorizontal: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveBadge: { flexDirection: 'row', alignItems: 'center' },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80', marginRight: 6 },
  updateText: { color: '#ffffff', fontSize: 11, fontWeight: '600' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  liquidatorBtn: { backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: '#ffffff', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 15, marginRight: 6 },
  liquidatorBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.2)', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  iconBtnText: { fontSize: 13 },
  brandRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  brandEmoji: { fontSize: 22, marginHorizontal: 6 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', marginRight: 6 },
  bar: { width: 4, backgroundColor: '#ffffff', marginHorizontal: 1, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  chartArrow: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', marginLeft: 1 },
  brandTitle: { color: '#ffffff', fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  brandTagline: { color: '#ffffff', fontSize: 9.5, textAlign: 'center', fontWeight: 'bold', marginTop: 3 },
  goldLine: { height: 2, backgroundColor: '#f59e0b', marginTop: 8 },
  content: { flex: 1, backgroundColor: '#ffffff' },
  contentContainer: { padding: 12, paddingBottom: 20 },
  card: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#c80000', borderRadius: 16, marginBottom: 14, overflow: 'hidden', elevation: 2 },
  cardHeader: { backgroundColor: '#c80000', paddingVertical: 8, alignItems: 'center' },
  cardHeaderText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', fontStyle: 'italic', letterSpacing: 1 },
  cardBody: { paddingVertical: 14, alignItems: 'center' },
  mainPrice: { color: '#c80000', fontSize: 38, fontWeight: '900', letterSpacing: -0.5 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginHorizontal: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  cardFooterCenter: { alignItems: 'center', padding: 10 },
  variationText: { color: '#c80000', fontSize: 13, fontWeight: 'bold' },
  subPriceBox: { alignItems: 'flex-end' },
  subPriceLabel: { fontSize: 10, color: '#374151', fontWeight: '600' },
  subPriceValue: { fontSize: 13, color: '#c80000', fontWeight: 'bold' },
  futuresCard: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#c80000', borderRadius: 16, padding: 12, marginBottom: 14, elevation: 1 },
  futuresTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  futuresTitle: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  infoIcon: { fontSize: 16 },
  futuresRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 },
  futuresValue: { fontSize: 32, fontWeight: '900', color: '#111827' },
  futuresChange: { fontSize: 15, fontWeight: '900', color: '#c80000' },
  marketStatus: { fontSize: 11, color: '#4b5563', marginTop: 6 },
  toolBtn: { backgroundColor: '#c45300', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, elevation: 2 },
  toolLeft: { flexDirection: 'row', alignItems: 'center' },
  calcIconBox: { backgroundColor: 'rgba(255,255,255,0.2)', width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  calcIconText: { fontSize: 20 },
  toolSub: { fontSize: 9.5, color: '#fef3c7', fontWeight: 'bold' },
  toolMain: { fontSize: 14, color: '#ffffff', fontWeight: '900' },
  toolArrow: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  traditionCard: { backgroundColor: '#2b0707', borderRadius: 16, padding: 20, marginBottom: 16, minHeight: 120, justifyContent: 'flex-end' },
  traditionBadge: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 },
  traditionGold: { color: '#f59e0b', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  traditionWhite: { color: '#ffffff', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  catScroll: { marginBottom: 12 },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f3f4f6', marginRight: 8 },
  catChipActive: { backgroundColor: '#c80000' },
  catChipText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  catChipTextActive: { color: '#ffffff' },
  newsCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#fee2e2', borderRadius: 14, padding: 12, marginBottom: 10 },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  newsCatBadge: { color: '#c80000', fontSize: 10, fontWeight: 'bold', backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  newsDate: { color: '#9ca3af', fontSize: 10 },
  newsTitle: { fontSize: 13, fontWeight: 'bold', color: '#111827', marginVertical: 4 },
  newsSummary: { fontSize: 11, color: '#4b5563', lineHeight: 16 },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  newsSource: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  newsReadMore: { fontSize: 10, color: '#c80000', fontWeight: 'bold' },
  chatContainer: { flex: 1, backgroundColor: '#f9fafb' },
  chatBanner: { backgroundColor: '#fef2f2', padding: 8, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#fee2e2' },
  chatBannerTitle: { fontSize: 11, fontWeight: 'bold', color: '#991b1b' },
  chatBannerStatus: { fontSize: 10, fontWeight: 'bold', color: '#059669' },
  chatList: { flex: 1 },
  chatBubbleContainer: { marginBottom: 10, maxWidth: '85%' },
  chatBubbleRight: { alignSelf: 'flex-end' },
  chatMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  chatSender: { fontSize: 10, fontWeight: 'bold', color: '#374151', marginRight: 4 },
  chatLocation: { fontSize: 9, color: '#9ca3af' },
  chatBubble: { padding: 10, borderRadius: 14 },
  chatBubbleOther: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb' },
  chatBubbleUser: { backgroundColor: '#c80000' },
  chatBubbleText: { fontSize: 12, color: '#1f2937' },
  chatBubbleTextUser: { color: '#ffffff' },
  chatBubbleTime: { fontSize: 9, color: '#9ca3af', textAlign: 'right', marginTop: 4 },
  chatBubbleTimeUser: { color: 'rgba(255,255,255,0.7)' },
  chatInputRow: { flexDirection: 'row', padding: 8, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  chatInput: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 },
  chatSendBtn: { backgroundColor: '#c80000', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  chatSendBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  profileCard: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#c80000', borderRadius: 16, padding: 14, marginBottom: 14 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#c80000', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  profileName: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  profileFinca: { fontSize: 11, color: '#4b5563', marginTop: 2 },
  profileVariety: { fontSize: 10, color: '#c80000', fontWeight: 'bold', marginTop: 2 },
  profileStatsRow: { flexDirection: 'row', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  profileStatItem: { flex: 1, alignItems: 'center', backgroundColor: '#f9fafb', padding: 8, borderRadius: 8, marginHorizontal: 2 },
  statLabel: { fontSize: 9, color: '#6b7280' },
  statVal: { fontSize: 12, fontWeight: 'bold', color: '#111827', marginTop: 2 },
  apkCard: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 16, padding: 14, marginBottom: 14 },
  apkTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  apkTitle: { fontSize: 13, fontWeight: 'bold', color: '#92400e' },
  apkTag: { fontSize: 9, fontWeight: 'bold', backgroundColor: '#059669', color: '#ffffff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  apkDesc: { fontSize: 11, color: '#78350f', marginVertical: 8, lineHeight: 15 },
  apkBtn: { backgroundColor: '#b45309', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  apkBtnText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  prefCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, padding: 14 },
  prefTitle: { fontSize: 13, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  prefLabel: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  prefSub: { fontSize: 10, color: '#9ca3af' },
  bottomNav: { backgroundColor: '#c20b0b', height: 56, marginBottom: 50, flexDirection: 'row', alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 16 },
  navDivider: { width: 1, height: 26, backgroundColor: 'rgba(0,0,0,0.2)' },
  navText: { color: 'rgba(255,255,255,0.8)', fontSize: 9.5, fontWeight: 'bold', marginTop: 2 },
  navActiveText: { color: '#ffffff', fontWeight: '900' },
  unreadBadge: { position: 'absolute', top: -4, right: -10, backgroundColor: '#f59e0b', width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  unreadBadgeText: { color: '#78350f', fontSize: 8, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#b30000' },
  modalClose: { fontSize: 18, color: '#6b7280', padding: 4 },
  infoBox: { backgroundColor: '#fef3c7', padding: 10, borderRadius: 10, marginBottom: 12 },
  infoBoxText: { fontSize: 11, color: '#92400e', lineHeight: 15 },
  inputLabel: { fontSize: 11, fontWeight: 'bold', color: '#374151', marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 8, fontSize: 14, fontWeight: 'bold', color: '#111827' },
  presetRow: { flexDirection: 'row', marginVertical: 6 },
  presetChip: { flex: 1, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center', marginHorizontal: 2, backgroundColor: '#f9fafb' },
  presetChipActive: { backgroundColor: '#fee2e2', borderColor: '#c80000' },
  presetText: { fontSize: 10, fontWeight: 'bold', color: '#4b5563' },
  presetTextActive: { color: '#c80000' },
  resultBox: { backgroundColor: '#fef2f2', borderWidth: 2, borderColor: '#c80000', borderRadius: 12, padding: 12, marginTop: 14 },
  resultHeader: { fontSize: 10, fontWeight: '900', color: '#991b1b', letterSpacing: 1, textAlign: 'center' },
  resultTotalLabel: { fontSize: 11, fontWeight: 'bold', color: '#4b5563', textAlign: 'center', marginTop: 6 },
  resultTotalVal: { fontSize: 24, fontWeight: '900', color: '#c80000', textAlign: 'center', marginVertical: 4 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  resultKey: { fontSize: 11, color: '#4b5563' },
  resultVal: { fontSize: 11, fontWeight: 'bold', color: '#111827' },
  shareReceiptBtn: { backgroundColor: '#c80000', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 12, marginBottom: 20 },
  shareReceiptText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  infoModalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, width: '100%', maxWidth: 360 },
  infoModalTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  infoModalDesc: { fontSize: 12, color: '#4b5563', lineHeight: 18, marginVertical: 8 },
  infoModalBtn: { backgroundColor: '#c80000', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  infoModalBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
});