import React, { useState } from 'react'
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import { RNGAMBanner } from '@callosum/react-native-google-ad-manager'

const BANNER_TEST = '/6499/example/banner' // returns only 320x50

const styles = StyleSheet.create({
  adBanner: {
    height: 300,
    width: 300,
    backgroundColor: 'darkorange',
  },
  container: { flex: 1 },
  headerContainer: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  itemContainer: {
    height: 80,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
  },
  tab: { flex: 1 },
  tabContainer: { flexDirection: 'row', paddingVertical: 12, marginTop: 8 },
  tabText: { textAlign: 'center', color: '#d5d5d5' },
  tabTextFocused: { color: '#000' },
  title: { textAlign: 'center', fontWeight: 'bold', fontSize: 24 },
  viewWithBannerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const Tab = ({ children, isFocused, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.tab}>
    <Text style={[styles.tabText, isFocused && styles.tabTextFocused]}>
      {children}
    </Text>
  </TouchableOpacity>
)

const Header = ({ isFlatListFocused, setIsFlatListFocused }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>RNGoogleAdManager Example</Text>

    <View style={styles.tabContainer}>
      <Tab
        isFocused={!isFlatListFocused}
        onPress={() => setIsFlatListFocused(false)}
      >
        View
      </Tab>
      <Tab
        isFocused={isFlatListFocused}
        onPress={() => setIsFlatListFocused(true)}
      >
        FlatList
      </Tab>
    </View>
  </View>
)

const AdBanner = ({ style }) => (
  <RNGAMBanner
    adId={BANNER_TEST}
    size={RNGAMBanner.sizes.BANNER}
    testDeviceIds={[RNGAMBanner.simulatorTestId]}
    onAdLoaded={() => console.log('########## loaded')}
    onAdFailedToLoad={error => console.log('########## failed:', error)}
    style={[styles.adBanner, style]}
  />
)

const ViewWithBanner = () => (
  <View style={styles.viewWithBannerContainer}>
    <AdBanner />
  </View>
)

const data = [...Array(48).keys()].reduce(
  (acc, curr) => ({
    ids: [...acc.ids, curr],
    data: {
      ...acc.data,
      [curr]: {
        id: curr,
        backgroundColor: curr % 2 === 0 ? 'lightgreen' : 'lightblue',
        isAd: curr !== 0 && curr % 6 === 0,
      },
    },
  }),
  { ids: [], data: {} }
)

const _keyExtractor = id => String(id)

const _renderItem = ({ item: id }) => {
  const { backgroundColor, isAd } = data.data[id]

  return isAd ? (
    <AdBanner style={{ alignSelf: 'center' }} />
  ) : (
    <View style={[styles.itemContainer, { backgroundColor }]} />
  )
}

const FlatListWithBanner = () => (
  <FlatList
    data={data.ids}
    keyExtractor={_keyExtractor}
    renderItem={_renderItem}
  />
)

export const Root = () => {
  const [isFlatListFocused, setIsFlatListFocused] = useState(true)

  return (
    <SafeAreaView style={styles.container}>
      <Header
        isFlatListFocused={isFlatListFocused}
        setIsFlatListFocused={setIsFlatListFocused}
      />

      {isFlatListFocused ? <FlatListWithBanner /> : <ViewWithBanner />}
    </SafeAreaView>
  )
}
